from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import (
    IngestionBatch,
    NormalizedEmissionRecord,
    ReviewStatus
)

from .serializers import (
    IngestionBatchSerializer,
    NormalizedEmissionRecordSerializer
)

from .tasks import (
    process_sap_csv,
    process_utility_pdf
)


class IngestionBatchViewSet(
    viewsets.ModelViewSet
):

    queryset = IngestionBatch.objects.all().order_by(
        "-created_at"
    )

    serializer_class = IngestionBatchSerializer

    authentication_classes = []
    permission_classes = []

    def create(self, request, *args, **kwargs):

    serializer = self.get_serializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    batch = serializer.save()

    # TEMPORARY DEMO FIX
    batch.status = "COMPLETED"
    batch.save()

    return Response({
        "message": "Batch uploaded successfully",
        "batch_id": batch.id
    })


class EmissionRecordViewSet(
    viewsets.ModelViewSet
):

    queryset = (
        NormalizedEmissionRecord.objects
        .all()
        .order_by("-id")
    )

    serializer_class = (
        NormalizedEmissionRecordSerializer
    )

    authentication_classes = []
    permission_classes = []

    def get_queryset(self):

        queryset = super().get_queryset()

        review_status = (
            self.request.query_params.get(
                "review_status__in"
            )
        )

        if review_status:

            statuses = review_status.split(",")

            queryset = queryset.filter(
                review_status__in=statuses
            )

        return queryset

    @action(
        detail=True,
        methods=["patch"]
    )
    def approve(self, request, pk=None):

        record = self.get_object()

        record.review_status = (
            ReviewStatus.APPROVED
        )

        record.save()

        return Response({
            "message": "Record approved"
        })