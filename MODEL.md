# Data Model Overview

- **Tenant / User**: Multitenant base with Role-Based Access.
- **Facility**: Spatially indexed (`GIST`) geography points representing operational bounds.
- **IngestionBatch**: Groups uploads. Maps to a `SourceSystem` enum (SAP, UTILITY, TRAVEL).
- **RawRecord**: JSONB storage of the exact unparsed row to ensure data lineage.
- **NormalizedEmissionRecord**: The core ESG ledger. Contains Scopes (1,2,3), activity metrics, computed `co2e`, and `review_status`. Tracks history via `django-simple-history`.