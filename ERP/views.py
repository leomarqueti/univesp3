from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

def login_page(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('products')
        return render(request, 'global/login.html', {
            'error': 'Usuário ou senha inválidos'
        })
    if request.user.is_authenticated:
        return redirect('products')
    return render(request, 'global/login.html')

def register_page(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        
        # Validações
        if password1 != password2:
            return render(request, 'global/register.html', {
                'error': 'As senhas não coincidem'
            })
        
        if User.objects.filter(username=username).exists():
            return render(request, 'global/register.html', {
                'error': 'Nome de usuário já existe'
            })
            
        if User.objects.filter(email=email).exists():
            return render(request, 'global/register.html', {
                'error': 'E-mail já está em uso'
            })
        
        # Criar usuário
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1
            )
            login(request, user)
            return redirect('products')
        except Exception as e:
            return render(request, 'global/register.html', {
                'error': f'Erro ao criar usuário: {str(e)}'
            })
    
    if request.user.is_authenticated:
        return redirect('products')
    return render(request, 'global/register.html')

@login_required(login_url='login')
def products_page(request):
    return render(request, 'global/products.html')

def logout_view(request):
    """
    Encerra a sessão do usuário e redireciona para a tela de login.
    """
    logout(request)
    return redirect('login')
