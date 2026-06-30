from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Cart, CartItem
from catalog.models import Product
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemWriteSerializer,
    CartItemUpdateSerializer,
)


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def cart_detail(request):
    cart = get_or_create_cart(request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def cart_add_item(request):
    serializer = CartItemWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    product = get_object_or_404(Product, id=serializer.validated_data["product_id"])
    quantity = serializer.validated_data["quantity"]

    if quantity > product.stock:
        return Response(
            {"error": f"Stock insuficiente. Disponible: {product.stock}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart = get_or_create_cart(request.user)
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, product=product, defaults={"quantity": 0}
    )
    cart_item.quantity += quantity

    if cart_item.quantity > product.stock:
        return Response(
            {"error": f"Stock insuficiente. Disponible: {product.stock}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item.save()
    return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([permissions.IsAuthenticated])
def cart_item_detail(request, item_id):
    cart = get_or_create_cart(request.user)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

    if request.method == "DELETE":
        cart_item.delete()
        return Response({"message": "Producto eliminado del carrito"}, status=status.HTTP_204_NO_CONTENT)

    serializer = CartItemUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    quantity = serializer.validated_data["quantity"]
    if quantity > cart_item.product.stock:
        return Response(
            {"error": f"Stock insuficiente. Disponible: {cart_item.product.stock}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item.quantity = quantity
    cart_item.save()
    return Response(CartItemSerializer(cart_item).data)
