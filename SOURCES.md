# Supported Sources & Normalization Rules

## 1. SAP (Fuel & Procurement)
- **Format**: CSV
- **Normalizations**: Translates German (`Werk` -> `plant_code`, `Datum` -> `posting_date`, `Menge` -> `quantity`). Converts `DD.MM.YYYY` to ISO8601.
- **Anomalies**: Flags negative spend, missing vendors.

## 2. Utility Portals
- **Format**: CSV / PDF
- **Normalizations**: Extracts `kwh`, detects tariff types (peak/offpeak).
- **Anomalies**: Flags overlapping billing periods or massive spikes (>200% MoM).

## 3. Travel (Concur/Navan)
- **Format**: CSV
- **Normalizations**: Lookups airport IATA codes. Converts travel class to emission factor multipliers.