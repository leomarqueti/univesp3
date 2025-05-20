from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from .views import login_page, register_page, products_page, logout_view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Frontend
    path('', lambda request: redirect('login'), name='home'),
    path('login/',    login_page,    name='login'),
    path('register/', register_page, name='register'),
    path('logout/',   logout_view,   name='logout'),
    path('products/', products_page, name='products'),

    # API
    path('api/', include('warehouse.urls')),
]

# Adicionar configuração para servir arquivos estáticos em produção
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
