# Generated by Django 3.0.6 on 2020-05-28 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('language', '0001_initial'),
        ('project', '0003_project_github'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='language',
            field=models.ManyToManyField(to='language.Language'),
        ),
    ]