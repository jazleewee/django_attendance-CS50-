from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('', views.logout, name = "logout"),
    path('search', views.search, name="search"),
    path('<str:company>', views.company, name="company"),

]