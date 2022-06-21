# Generated by Django 4.0.4 on 2022-06-20 04:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_device_ip'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='gateway',
            field=models.GenericIPAddressField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='device',
            name='subnet',
            field=models.GenericIPAddressField(default=None, null=True),
        ),
    ]
