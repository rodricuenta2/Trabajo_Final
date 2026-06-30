import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = search ? { search } : {};
        const { data } = await api.get("/products/", { params });
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId, 1);
      setMessage({ type: "success", text: "Producto agregado al carrito" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Error al agregar al carrito";
      setMessage({ type: "danger", text: errorMsg });
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Catálogo de Productos</h1>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {products.length === 0 ? (
        <p className="text-muted">No hay productos disponibles.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm">
                {product.image && (
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {product.description.substring(0, 100)}...
                  </p>
                  <p className="fw-bold fs-5 text-primary">
                    ${product.price.toLocaleString("es-CL")}
                  </p>
                  <p className="text-muted small">
                    Stock: {product.stock} unidades
                  </p>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-outline-secondary btn-sm flex-grow-1"
                    >
                      Ver detalle
                    </Link>
                    {user && product.stock > 0 && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
