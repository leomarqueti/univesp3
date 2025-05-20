from django.urls import path
from .views import (
    home_view,
    CustomAuthToken, LogoutView,
    MeasureListCreateView, TypeListCreateView,
    ProductListCreateView, ProductDetailView
)

urlpatterns = [
    path('',                     home_view,                  name='redirect-product'),
    path('estoque/',         ProductListCreateView.as_view(),   name='product-list-create'),
    path('estoque/<int:pk>/',ProductDetailView.as_view(),      name='product-detail'),
    path('medida/',          MeasureListCreateView.as_view(),   name='measure-list-create'),
    path('tipo/',            TypeListCreateView.as_view(),      name='type-list-create'),
    path('login/',           CustomAuthToken.as_view(),         name='api-login'),
    path('logout/',          LogoutView.as_view(),              name='api-logout'),
]
