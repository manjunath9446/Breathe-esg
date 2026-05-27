from django.contrib import admin
from .models import *

admin.site.register(Tenant)
admin.site.register(User)
admin.site.register(Facility)
admin.site.register(IngestionBatch)
admin.site.register(RawRecord)
admin.site.register(NormalizedEmissionRecord)