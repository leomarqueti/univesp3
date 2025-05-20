from django.shortcuts import redirect
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from .models import Product, Type, Measure
from .serializers import ProductSerializer, TypeSerializer, MeasureSerializer

def home_view(request):
    # redireciona "/" para o frontend de produtos
    return redirect('products')

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=resp.data['token'])
        return Response({'token': token.key})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.auth.delete()
        return Response(status=204)

class TypeListCreateView(generics.ListCreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer

class MeasureListCreateView(generics.ListCreateAPIView):
    queryset = Measure.objects.all()
    serializer_class = MeasureSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
