import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="mb-4">Panel de Administración</h1>
      <div className="alert alert-info">
        Bienvenido, <strong>{user?.username}</strong>. Tienes permisos de
        administrador.
      </div>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <p className="card-text text-muted">
                Gestiona el catálogo de productos
              </p>
              <Link to="/admin/products" className="btn btn-primary">
                Ir a Productos
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Sitio Público</h5>
              <p className="card-text text-muted">
                Ver el catálogo como cliente
              </p>
              <Link to="/" className="btn btn-outline-primary">
                Ir al Catálogo
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Admin Django</h5>
              <p className="card-text text-muted">
                Panel de administración de Django
              </p>
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                className="btn btn-outline-secondary"
                rel="noreferrer"
              >
                Ir al Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
