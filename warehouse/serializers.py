from rest_framework import serializers

from .models import Measure, Product, Type


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'name']


class MeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measure
        fields = ['id', 'name_abv', 'name']


class ProductSerializer(serializers.ModelSerializer):
    type = TypeSerializer(read_only=True)
    um = MeasureSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(),
                                                 source='type',
                                                 write_only=True)
    um_id = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all(),
                                               source='um',
                                               write_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'stock', 'type', 'type_id', 'value',
            'um', 'um_id'
        ]
