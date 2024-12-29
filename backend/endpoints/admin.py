from django.contrib import admin
from .models.all_models import all_models

for model in all_models:
    admin.site.register(model)
