from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    IngestionBatchViewSet,
    EmissionRecordViewSet
)

router = DefaultRouter()

router.register(
    r"batches",
    IngestionBatchViewSet
)

router.register(
    r"emissions",
    EmissionRecordViewSet
)

urlpatterns = [
    path("", include(router.urls)),
]