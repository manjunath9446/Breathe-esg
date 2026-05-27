# Architectural Decisions

1. **PostGIS for Facilities**: Used `GEOGRAPHY(POINT, 4326)` to support future physical risk assessments (e.g., flood zones) and precise distance calculations for Scope 3 travel emissions, avoiding inaccurate Haversine math at the application layer.
2. **Asynchronous Pipeline (Celery + Redis)**: Ingestion tasks are decoupled. Uploading an SAP CSV immediately returns a 202 Accepted. Celery uses Pandas to process rows vectorized, ensuring no timeouts on massive files.
3. **Immutable Audit Trails**: Used `django-simple-history`. Financial grade ESG requires tracking who changed a record and when. Locking mechanisms prevent any mutations post-audit lock.
4. **JWT & RBAC**: Implemented custom Django roles (ADMIN, ANALYST, REVIEWER, AUDITOR). Reviewers cannot upload; Analysts cannot approve. Auditors have read-only global access.
5. **No TypeScript (Frontend)**: Strictly adhered to the requirement. Used React Query for state caching and React Hook Form for uncontrolled, performant form validations.