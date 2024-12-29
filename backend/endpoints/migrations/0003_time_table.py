# Generated by Django 5.1.4 on 2024-12-29 11:01

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('endpoints', '0002_alter_administrator_login'),
    ]

    operations = [
        migrations.CreateModel(
            name='Time_table',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('court', models.IntegerField()),
                ('date', models.DateField()),
                ('guest_one', models.TextField(max_length=255, null=True)),
                ('guest_two', models.TextField(max_length=255, null=True)),
                ('hour_count', models.DecimalField(decimal_places=2, max_digits=4)),
                ('is_first_payment', models.BooleanField(default=True, null=True)),
                ('is_player_one_payed', models.BooleanField(default=False, null=True)),
                ('is_player_two_payed', models.BooleanField(default=False, null=True)),
                ('layer', models.IntegerField()),
                ('player_one', models.UUIDField(null=True)),
                ('player_two', models.UUIDField(null=True)),
                ('time_from', models.TextField(max_length=5)),
                ('time_to', models.TextField(max_length=5)),
            ],
        ),
    ]