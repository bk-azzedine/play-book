from django.contrib import admin
from django.urls import path, include

from generate_service import views

urlpatterns = [
    path('generate/', views.generate, name='generate'),
]
