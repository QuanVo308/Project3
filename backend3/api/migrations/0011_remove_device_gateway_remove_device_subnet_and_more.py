# Generated by Django 4.0.5 on 2022-06-20 06:42

from django.db import migrations, models
import django.db.models.deletion


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
        migrations.AlterField(
            model_name='popplus',
            name='branch',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.branch', to_field='name'),
        ),
    ]