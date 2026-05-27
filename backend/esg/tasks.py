import pandas as pd
import requests
import pdfplumber
import re

from io import StringIO
from celery import shared_task

from .models import (
    IngestionBatch,
    RawRecord,
    NormalizedEmissionRecord,
    AuditLog,
    Tenant
)


EMISSION_FACTORS = {
    "fuel": 2.67,
    "electricity": 0.82,
    "flight": 0.115,
    "hotel": 12,
    "ground": 0.04,
}


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


@shared_task
def process_sap_csv(batch_id):

    batch = IngestionBatch.objects.get(id=batch_id)

    batch.status = "PARSING"
    batch.save()

    response = requests.get(batch.file_url)

    df = pd.read_csv(StringIO(response.text))

    tenant = Tenant.objects.first()

    for idx, row in df.iterrows():

        payload = clean_payload(row.to_dict())

        raw = RawRecord.objects.create(
            batch=batch,
            source_row_number=idx + 1,
            raw_payload=payload,
            processed=True
        )

        quantity = extract_numeric_value(payload)

        co2e = quantity * 2.67

        record = NormalizedEmissionRecord.objects.create(
            tenant=tenant,
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

        AuditLog.objects.create(
            record=record,
            action="CREATED",
            performed_by="system",
            new_value={"co2e": co2e}
        )

    batch.status = "COMPLETED"
    batch.save()


@shared_task
def process_utility_pdf(batch_id):

    batch = IngestionBatch.objects.get(id=batch_id)

    response = requests.get(batch.file_url)

    with open("temp_bill.pdf", "wb") as f:
        f.write(response.content)

    with pdfplumber.open("temp_bill.pdf") as pdf:

        text = ""

        for page in pdf.pages:
            text += page.extract_text() or ""

    match = re.search(r"(\\d+[\\.,]?\\d*)\\s*kWh", text)

    usage = float(match.group(1)) if match else 0

    raw = RawRecord.objects.create(
        batch=batch,
        raw_payload={"parsed_text": text[:1000]},
        processed=True
    )

    tenant = Tenant.objects.first()

    NormalizedEmissionRecord.objects.create(
        tenant=tenant,
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


@shared_task
def process_travel_csv(batch_id):

    batch = IngestionBatch.objects.get(id=batch_id)

    response = requests.get(batch.file_url)

    df = pd.read_csv(StringIO(response.text))

    tenant = Tenant.objects.first()

    for idx, row in df.iterrows():

        payload = clean_payload(row.to_dict())

        distance = float(payload.get("Distance_km", 0))

        travel_type = payload.get("Travel Type", "Flight")

        if travel_type.lower() == "flight":
            factor = 0.115
            scope = 3

        elif travel_type.lower() == "hotel":
            factor = 12
            scope = 3

        else:
            factor = 0.04
            scope = 3

        raw = RawRecord.objects.create(
            batch=batch,
            source_row_number=idx + 1,
            raw_payload=payload,
            processed=True
        )

        NormalizedEmissionRecord.objects.create(
            tenant=tenant,
            raw_record=raw,
            scope=scope,
            activity_type=travel_type,
            activity_value=distance,
            activity_unit="km",
            normalized_value=distance,
            normalized_unit="km",
            emission_factor=factor,
            co2e=distance * factor,
            confidence_score=0.92,
            review_status="PENDING"
        )

    batch.status = "COMPLETED"
    batch.save()