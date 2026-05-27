from rest_framework import serializers
from .models import (
    IngestionBatch,
    NormalizedEmissionRecord
)

class IngestionBatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = IngestionBatch
        fields = "__all__"


class NormalizedEmissionRecordSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = NormalizedEmissionRecord
        fields = "__all__"