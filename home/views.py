from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Project, Skill, Contact
from django.shortcuts import render

# Fetch all projects

def home(request):
    return render(request, 'index.html')  

def project_list(request):
    projects = Project.objects.all()
    project_data = []
    
    for project in projects:
        project_data.append({
            "title": project.title,
            "description": project.description,
            "image": request.build_absolute_uri(project.image.url),  # This creates the full URL
            "github_link": project.github_link
        })
    
    return JsonResponse({"projects": project_data})
# Fetch all skills
def skill_list(request):
    skills = list(Skill.objects.all().values("title", "description"))
    return JsonResponse({"skills": skills})

# Fetch all contact messages (for admin purposes, if needed)
def contact_list(request):
    contacts = list(Contact.objects.all().values("name", "email", "message"))
    return JsonResponse({"contacts": contacts})

# Handle contact form submission
@csrf_exempt
def submit_contact(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            contact = Contact.objects.create(
                name=data.get("name"),
                email=data.get("email"),
                message=data.get("message")
            )
            return JsonResponse({"message": "Contact saved successfully!", "id": contact.id}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)
