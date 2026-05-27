from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from simple_history.models import HistoricalRecords


class RoleChoices(models.TextChoices):

    ADMIN = "ADMIN", "Admin"

    ANALYST = "ANALYST", "Analyst"

    REVIEWER = "REVIEWER", "Reviewer"

    AUDITOR = "AUDITOR", "Auditor"


class Tenant(models.Model):

    name = models.CharField(
        max_length=255
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name


class User(AbstractUser):

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.ANALYST
    )

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="esg_users",
        blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="esg_user_permissions",
        blank=True
    )

    def __str__(self):

        return self.username


class Facility(models.Model):

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(
        max_length=255
    )

    location_lat = models.FloatField(
        null=True,
        blank=True
    )

    location_lon = models.FloatField(
        null=True,
        blank=True
    )

    def __str__(self):

        return self.name


class SourceSystem(models.TextChoices):

    SAP = "SAP", "SAP ERP"

    UTILITY = "UTILITY", "Utility Portal"

    TRAVEL = "TRAVEL", "Travel System"


class IngestionBatch(models.Model):

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    source_system = models.CharField(
        max_length=50,
        choices=SourceSystem.choices
    )

    file_url = models.URLField()

    status = models.CharField(
        max_length=50,
        default="PENDING"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.source_system} - {self.status}"


class RawRecord(models.Model):

    batch = models.ForeignKey(
        IngestionBatch,
        on_delete=models.CASCADE
    )

    raw_payload = models.JSONField()

    processed = models.BooleanField(
        default=False
    )

    def __str__(self):

        return f"Raw Record {self.id}"


class ReviewStatus(models.TextChoices):

    PENDING = "PENDING", "Pending"

    FLAGGED = "FLAGGED", "Flagged"

    APPROVED = "APPROVED", "Approved"

    REJECTED = "REJECTED", "Rejected"

    LOCKED = "LOCKED", "Locked"


class NormalizedEmissionRecord(models.Model):

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    raw_record = models.OneToOneField(
        RawRecord,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    scope = models.IntegerField(
        choices=[
            (1, "Scope 1"),
            (2, "Scope 2"),
            (3, "Scope 3"),
        ]
    )

    activity_type = models.CharField(
        max_length=100
    )

    activity_value = models.FloatField()

    activity_unit = models.CharField(
        max_length=20
    )

    normalized_value = models.FloatField()

    normalized_unit = models.CharField(
        max_length=20
    )

    emission_factor = models.FloatField()

    co2e = models.FloatField()

    confidence_score = models.FloatField(
        default=1.0
    )

    anomaly_notes = models.TextField(
        blank=True,
        null=True
    )

    review_status = models.CharField(
        max_length=20,
        choices=ReviewStatus.choices,
        default=ReviewStatus.PENDING
    )

    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_records"
    )

    locked = models.BooleanField(
        default=False
    )

    history = HistoricalRecords()

    def clean(self):

        if self.locked:

            raise ValidationError(
                "Locked records cannot be modified."
            )

    def __str__(self):

        return f"{self.activity_type} - {self.co2e}"
class AuditLog(models.Model):

    record = models.ForeignKey(
        "NormalizedEmissionRecord",
        on_delete=models.CASCADE
    )

    action = models.CharField(
        max_length=100
    )

    previous_value = models.JSONField(
        null=True,
        blank=True
    )

    new_value = models.JSONField(
        null=True,
        blank=True
    )

    performed_by = models.CharField(
        max_length=255
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.action} - {self.performed_by}"