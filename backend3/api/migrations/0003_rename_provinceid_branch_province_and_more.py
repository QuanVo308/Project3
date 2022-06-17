# Generated by Django 4.0.4 on 2022-06-17 02:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_province_branch_provinceid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='branch',
            old_name='provinceID',
            new_name='province',
        ),
        migrations.RenameField(
            model_name='device',
            old_name='brandID',
            new_name='brand',
        ),
        migrations.RenameField(
            model_name='pop',
            old_name='popPlusID',
            new_name='popPlus',
        ),
        migrations.RenameField(
            model_name='pop',
            old_name='provinceID',
            new_name='province',
        ),
        migrations.RenameField(
            model_name='popplus',
            old_name='branchID',
            new_name='branch',
        ),
        migrations.RenameField(
            model_name='province',
            old_name='areaID',
            new_name='area',
        ),
    ]
