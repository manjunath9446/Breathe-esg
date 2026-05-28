import pandas as pd
import requests
import pdfplumber
import re

from io import StringIO

from .models import (
    IngestionBatch,
    RawRecord,
    NormalizedEmissionRecord,
    AuditLog
)


def clean_payload(payload):

    cleaned = {}

    for k, v in payload.items():

        if pd.isna(v):
            cleaned[k] = None

        elif isinstance(v, (int, float, str, bool)):
            cleaned[k] = v

        else:
            cleaned[k] = str(v)

    return cleaned


def extract_numeric_value(payload):

    for value in payload.values():

        try:
            return float(value)

        except:
            continue

    return 0


def process_sap_csv(batch_id):

    batch = IngestionBatch.objects.get(id=batch_id)

    batch.status = "PARSING"
    batch.save()

    response = requests.get(batch.file_url)

    df = pd.read_csv(StringIO(response.text))

    for idx, row in df.iterrows():

        payload = clean_payload(
            row.to_dict()
        )

        raw = RawRecord.objects.create(
            batch=batch,
            raw_payload=payload,
            processed=True
        )

        quantity = extract_numeric_value(
            payload
        )

        co2e = quantity * 2.67

        record = (
            NormalizedEmissionRecord.objects.create(
                raw_record=raw,
                scope=1,
                activity_type="fuel",
                activity_value=quantity,
                activity_unit="L",
                normalized_value=quantity,
                normalized_unit="L",
                emission_factor=2.67,
                co2e=co2e,
                confidence_score=0.95,
                review_status="PENDING"
            )
        )

        AuditLog.objects.create(
            record=record,
            action="CREATED",
            performed_by="system",
            new_value={
                "co2e": co2e
            }
        )

    batch.status = "COMPLETED"
    batch.save()


def process_utility_pdf(batch_id):

    batch = IngestionBatch.objects.get(
        id=batch_id
    )

    response = requests.get(
        batch.file_url
    )

    with open(
        "temp_bill.pdf",
        "wb"
    ) as f:

        f.write(response.content)

    with pdfplumber.open(
        "temp_bill.pdf"
    ) as pdf:

        text = ""

        for page in pdf.pages:

            text += (
                page.extract_text() or ""
            )

    match = re.search(
        r"(\\d+[\\.,]?\\d*)\\s*kWh",
        text
    )

    usage = (
        float(match.group(1))
        if match else 0
    )

    raw = RawRecord.objects.create(
        batch=batch,
        raw_payload={
            "parsed_text": text[:1000]
        },
        processed=True
    )

    NormalizedEmissionRecord.objects.create(
        raw_record=raw,
        scope=2,
        activity_type="electricity",
        activity_value=usage,
        activity_unit="kWh",
        normalized_value=usage,
        normalized_unit="kWh",
        emission_factor=0.82,
        co2e=usage * 0.82,
        confidence_score=0.90,
        review_status="PENDING"
    )

    batch.status = "COMPLETED"
    batch.save()