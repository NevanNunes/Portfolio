# Generated by Django 5.1.6 on 2025-03-22 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_alter_project_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='image',
            field=models.ImageField(upload_to='media/portfolio/images/'),
        ),
    ]
