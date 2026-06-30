import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchProducts = () => {
    api
      .get("/admin/products/")
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/admin/products/${id}/`);
      setMessage({ type: "success", text: "Producto eliminado" });
      fetchProducts();
    } catch {
      setMessage({ type: "danger", text: "Error al eliminar producto" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        <Link to="/admin/products/new" className="btn btn-success">
          + Nuevo Producto
        </Link>
      </div>
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`}>
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          />
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${Number(product.price).toLocaleString("es-CL")}</td>
                <td>{product.stock}</td>
                <td>
                  {product.available ? (
                    <span className="badge bg-success">Sí</span>
                  ) : (
                    <span className="badge bg-danger">No</span>
                  )}
                </td>
                <td>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
