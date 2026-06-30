# E-Commerce - Entrega Final Portafolio

Aplicación web e-commerce con **Django REST Framework** (backend) y **React + Vite** (frontend).

## Repositorio

[https://github.com/rodricuenta2/Trabajo_Final](https://github.com/rodricuenta2/Trabajo_Final)

## Requisitos

- Python 3.10+
- Node.js 18+
- npm

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/rodricuenta2/Trabajo_Final.git
cd Trabajo_Final
```

### 2. Backend (Django)

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r backend/requirements.txt

# Migraciones y datos de prueba
cd backend
python manage.py migrate
python manage.py seed_data

# Iniciar servidor
python manage.py runserver
```

El backend corre en `http://localhost:8000`.

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.

## Rutas principales

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Catálogo de productos |
| `/products/:id` | Detalle de producto |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |

### Cliente (requiere autenticación)
| Ruta | Descripción |
|------|-------------|
| `/cart` | Carrito de compras |
| `/orders/:id` | Confirmación de compra |

### Administrador (requiere staff)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Panel de administración |
| `/admin/products` | Gestión de productos (CRUD) |
| `/admin/products/new` | Crear producto |
| `/admin/products/:id/edit` | Editar producto |

### API REST
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login (JWT) |
| POST | `/api/auth/register/` | Registro |
| GET | `/api/auth/me/` | Usuario actual |
| GET | `/api/products/` | Listar productos |
| GET | `/api/products/:id/` | Detalle producto |
| GET/POST | `/api/cart/` | Ver/agregar al carrito |
| PATCH/DELETE | `/api/cart/items/:id/` | Actualizar/eliminar item |
| GET/POST | `/api/orders/` | Listar/crear órdenes |
| CRUD | `/api/admin/products/` | Admin: gestión productos |

Panel admin Django: `http://localhost:8000/admin/`

## Credenciales de prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Administrador | `admin` | `admin123` |
| Cliente | `cliente` | `cliente123` |

## Tecnologías

- **Backend**: Django 6.0, Django REST Framework, JWT (SimpleJWT), SQLite
- **Frontend**: React 19, Vite, React Router, Axios, Bootstrap 5
