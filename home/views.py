from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Work  # Assuming your model has fields: user, text

def home(request):
    if not request.user.is_authenticated:
        return redirect("login")
    return render(request, 'home.html')

def profile(request):
    if not request.user.is_authenticated:
        return redirect(loginpage)
    return render(request,'profile.html')

def signup(request):
    if request.user.is_authenticated:
        return redirect(home)
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password1')
        if username == '' or password == '':
            return HttpResponse('please fill all information')
        elif User.objects.filter(username=username).exists():
            return HttpResponse('username exists try another')
        
        user = User.objects.create_user(username=username,password=password)
        login(request,user)
        return redirect(home)

    return render(request,'signup.html')

def loginpage(request):
    if request.user.is_authenticated:
        return redirect(home)
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(home)
        else:
            return HttpResponse('user not found')
    return render(request, 'login.html')

def logoutpage(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect("login")

# Get todo list
def gettodolist(request):
    if not request.user.is_authenticated:
        return redirect("login")
    todos = request.user.userwork.all()  # related_name
    # Return list of objects with id and text
    todo_list = [{"id": todo.todoid, "text": todo.text} for todo in todos]
    return JsonResponse({"list": todo_list})

# Create todo
@csrf_exempt
def create_todo(request):
    if not request.user.is_authenticated:
        return redirect("login")
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            text = data.get("text", "").strip()
            if not text:
                return JsonResponse({"error": "Text cannot be empty"}, status=400)
            todo = Work.objects.create(user=request.user, text=text)
            return JsonResponse({"id": todo.todoid, "text": todo.text}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Update todo
@csrf_exempt
def update_todo(request, todo_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if request.method == "PUT":
        try:
            todo = Work.objects.get(todoid=todo_id, user=request.user)
            data = json.loads(request.body)
            text = data.get("text", "").strip()
            if not text:
                return JsonResponse({"error": "Text cannot be empty"}, status=400)
            todo.text = text
            todo.save()
            return JsonResponse({"id": todo.todoid, "text": todo.text})
        except Work.DoesNotExist:
            return JsonResponse({"error": "Todo not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Delete todo
@csrf_exempt
def delete_todo(request, todo_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if request.method == "DELETE":
        try:
            todo = Work.objects.get(todoid=todo_id, user=request.user)
            todo.delete()
            return JsonResponse({"success": True})
        except Work.DoesNotExist:
            return JsonResponse({"error": "Todo not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def delete_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    if request.method == "DELETE":
        try:
            user = request.user
            logout(request)  # logout before deleting
            user.delete()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)