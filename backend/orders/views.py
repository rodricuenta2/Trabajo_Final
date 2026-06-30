from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response(
                {"error": "El carrito está vacío"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for item in cart.items.all():
            if item.quantity > item.product.stock:
                return Response(
                    {
                        "error": f"Stock insuficiente para {item.product.name}. Disponible: {item.product.stock}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        total = cart.total
        order = Order.objects.create(user=request.user, total=total)

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                quantity=item.quantity,
                price=item.product.price,
            )
            product = item.product
            product.stock -= item.quantity
            product.save()

        cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
