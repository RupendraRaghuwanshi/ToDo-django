from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.loginpage, name='login'),
    path('logout/', views.logoutpage, name='logout'),
    path('api/gettodolist/', views.gettodolist, name='gettodolist'),
    path('api/create_todo/', views.create_todo, name='create_todo'),
    path('api/update_todo/<int:todo_id>/', views.update_todo, name='update_todo'),
    path('api/delete_todo/<int:todo_id>/', views.delete_todo, name='delete_todo'),
    path('signup/',views.signup,name='signup'),
    path('profile/',views.profile,name='profile'),
    path('delete/',views.delete_profile,name='delete_profile'),
]