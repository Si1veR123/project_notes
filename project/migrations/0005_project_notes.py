# Generated by Django 3.0.6 on 2020-05-28 21:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0004_project_language'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='notes',
            field=models.TextField(default='NOTES'),
            preserve_default=False,
        ),
    ]