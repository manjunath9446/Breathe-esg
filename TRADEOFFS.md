# Tradeoffs

1. **PyPDF vs. OCR**: We rely on `PyPDF2` text extraction for utility bills. *Tradeoff*: Faster processing and no reliance on heavy external dependencies (like Tesseract), but will fail on scanned image PDFs.
2. **Pandas Memory Limits**: CSV files are loaded into memory via Pandas. *Tradeoff*: Very fast vectorization and data cleaning, but a 10GB CSV would OOM a standard container. Mitigated by chunking streams in Celery in production.
3. **Distance Estimation Mock**: For Travel logs, we assume direct flight paths between parsed airports. True Scope 3 calculation requires precise routing/layover models.