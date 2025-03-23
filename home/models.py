from django.db import models

class Project(models.Model):  # <-- Add models.Model here
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='media/portfolio/images/')
    github_link = models.URLField(max_length=200)

    def __str__(self):
        return self.title

class Skill(models.Model):  # <-- Add models.Model here
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title   

class Contact(models.Model):  # <-- Add models.Model here
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    message = models.TextField()

    def __str__(self):
        return self.email    
