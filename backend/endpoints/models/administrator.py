import uuid
from django.db import models

class Administrator(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    name = models.CharField(null=False, max_length=15)    
    login = models.CharField(null=False, max_length=15, unique=True)    
    password = models.CharField(null=False, max_length=256)    
    is_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    