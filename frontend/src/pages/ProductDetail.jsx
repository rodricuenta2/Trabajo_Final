import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    api
      .get(`/products/${id}/`)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return;
    try {
      await addItem(product.id, quantity);
      setMessage({ type: "success", text: "Producto agregado al carrito" });
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Error al agregar",
      });
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

  if (!product) {
    return (
      <div className="alert alert-warning">
        Producto no encontrado.{" "}
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="row">
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
      <div className="col-md-6">
        {product.image ? (
          <img
            src={product.image}
            className="img-fluid rounded shadow"
            alt={product.name}
          />
        ) : (
          <div
            className="bg-light rounded d-flex align-items-center justify-content-center"
            style={{ height: "400px" }}
          >
            <span className="text-muted">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="col-md-6">
        <h1>{product.name}</h1>
        <p className="text-muted">{product.description}</p>
        <p className="fs-3 fw-bold text-primary">
          ${product.price.toLocaleString("es-CL")}
        </p>
        <p className={product.stock > 0 ? "text-success" : "text-danger"}>
          {product.stock > 0
            ? `Stock disponible: ${product.stock} unidades`
            : "Producto agotado"}
        </p>
        {user && product.stock > 0 && (
          <div className="d-flex align-items-center gap-3 mt-4">
            <div className="input-group" style={{ width: "140px" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                min="1"
                max={product.stock}
                onChange={(e) =>
                  setQuantity(
                    Math.min(product.stock, Math.max(1, Number(e.target.value)))
                  )
                }
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
              >
                +
              </button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
              Agregar al Carrito
            </button>
          </div>
        )}
        {!user && (
          <p className="mt-3">
            <Link to="/login">Inicia sesión</Link> para agregar productos al
            carrito.
          </p>
        )}
        <Link to="/" className="btn btn-outline-secondary mt-3">
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail;
