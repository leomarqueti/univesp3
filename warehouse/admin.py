from django.contrib import admin

# Register your models here.
from .models import Measure, Product, Type


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )
    list_display_links = (
        'id',
        'name',
    )
    search_fields = (
        'id',
        'name',
    )
    ordering = ('-id',)


@admin.register(Measure)
class MeasureAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name_abv',
        'name',
    )
    list_display_links = (
        'id',
        'name_abv',
    )
    search_fields = (
        'id',
        'name_abv',
        'name',
    )
    ordering = ('-id',)


@admin.register(Product)
class Productdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'type',
        'stock',
    )
    list_display_links = (
        'id',
        'name',
    )
    search_fields = (
        'id',
        'name',
        'type',
    )
    ordering = ('-id',)
