from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from catalog.models import Product


class Command(BaseCommand):
    help = "Crea datos de prueba: admin, cliente y productos"

    def handle(self, *args, **options):
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin123")
            self.stdout.write(self.style.SUCCESS("Admin creado: admin / admin123"))

        if not User.objects.filter(username="cliente").exists():
            User.objects.create_user("cliente", "cliente@example.com", "cliente123")
            self.stdout.write(self.style.SUCCESS("Cliente creado: cliente / cliente123"))

        if Product.objects.count() == 0:
            products = [
                Product(name="Laptop Gamer", description="Laptop con RTX 4060, 16GB RAM, 512GB SSD", price=899990, stock=10),
                Product(name="Mouse Inalámbrico", description="Mouse ergonómico con 6 botones", price=24990, stock=50),
                Product(name="Teclado Mecánico", description="Teclado RGB switches Cherry MX", price=59990, stock=30),
                Product(name="Monitor 27\" 4K", description="Monitor IPS 60Hz 4K UHD", price=349990, stock=15),
                Product(name="Audífonos Bluetooth", description="Audífonos over-ear con cancelación de ruido", price=79990, stock=25),
                Product(name="Webcam HD", description="Cámara web 1080p con micrófono", price=34990, stock=40),
                Product(name="Hub USB-C", description="Hub 7 en 1 con HDMI, USB-A, SD", price=19990, stock=60),
                Product(name="SSD 1TB", description="Disco SSD NVMe 1TB", price=89990, stock=20),
            ]
            Product.objects.bulk_create(products)
            self.stdout.write(self.style.SUCCESS(f"{len(products)} productos creados"))
        else:
            self.stdout.write("Los productos ya existen, saltando creación")
