from django.db import models
import uuid

class Time_table(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    court = models.IntegerField(
        null=False
    )
    
    date = models.DateField(
        null=False
    )
    
    guest_one = models.TextField(
        max_length=255,
        null=True
    )
    
    guest_two = models.TextField(
        max_length=255,
        null=True
    )
    
    hour_count = models.DecimalField(
        decimal_places=2,
        max_digits=4,
        null=False        
    )
    
    is_first_payment = models.BooleanField(
        default=True,
        null=True
    )
    
    is_player_one_payed = models.BooleanField(
        default=False,
        null=True
    )
    
    is_player_two_payed = models.BooleanField(
        default=False,
        null=True
    )
    
    layer = models.IntegerField(
        null=False
    )
    
    player_one = models.UUIDField(
        null=True
    )
    
    player_two = models.UUIDField(
        null=True
    )
    
    time_from = models.TextField(
        max_length=5,
        null=False
    )
    
    time_to = models.TextField(
        max_length=5,
        null=False
    )
    