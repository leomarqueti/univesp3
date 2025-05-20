from django.db import models


# Create your models here.
class Type(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=200,
        verbose_name='Nome',
    )

    class Meta:
        verbose_name = "Tipo"
        verbose_name_plural = "Tipos"

    def __str__(self):
        return self.name


class Measure(models.Model):
    id = models.AutoField(primary_key=True)
    name_abv = models.CharField(
        max_length=3,
        verbose_name='Sigla',
    )
    name = models.CharField(
        max_length=240,
        verbose_name='Nome'
    )

    class Meta:
        verbose_name = 'Medida'
        verbose_name_plural = 'Medidas'

    def __str__(self):
        return f'{self.name_abv} - {self.name}'


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=200,
        verbose_name='Nome',
    )
    description = models.TextField(
        max_length=500,
        verbose_name='Descrição',
    )
    stock = models.IntegerField()
    type = models.ForeignKey(
        Type,
        on_delete=models.CASCADE,
        related_name='type',
        verbose_name="Tipo"
    )
    value = models.FloatField()
    um = models.ForeignKey(
        Measure,
        on_delete=models.PROTECT,
        related_name='measure',
        verbose_name='Unidade de medida',
    )

    class Meta:
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'

    def __str__(self):
        return self.name
