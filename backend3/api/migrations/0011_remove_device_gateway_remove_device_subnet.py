# Generated by Django 4.0.4 on 2022-06-20 07:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_device_gateways'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='gateway',
        ),
        migrations.RemoveField(
            model_name='device',
            name='subnet',
        ),
    ]
