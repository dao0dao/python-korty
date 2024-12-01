from django.contrib import admin
from .models.all_models import __all__

# Register your models here.
for model_name in __all__:
    model = globals().get(model_name)
    if model:
        admin.site.register(model)
