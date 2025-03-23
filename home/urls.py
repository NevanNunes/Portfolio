from django.urls import path
from .views import project_list, skill_list, contact_list, submit_contact,home

urlpatterns = [
    path("", home, name="home"),  # Home page
    path("projects/", project_list, name="project_list"),  # Get all projects
    path("skills/", skill_list, name="skill_list"),  # Get all skills
    path("contacts/", contact_list, name="contact_list"),  # Get all contact messages (for admin)
    path("submit-contact/", submit_contact, name="submit_contact"),  # Submit contact form
]
