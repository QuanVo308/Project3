# Generated by Django 4.0.4 on 2022-06-20 03:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_area_name_alter_branch_name_alter_brand_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='ip',
            field=models.GenericIPAddressField(),
        ),
    ]
