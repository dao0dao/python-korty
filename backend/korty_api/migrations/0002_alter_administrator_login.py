# Generated by Django 5.1.4 on 2024-12-08 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('korty_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='administrator',
            name='login',
            field=models.CharField(max_length=15, unique=True),
        ),
    ]