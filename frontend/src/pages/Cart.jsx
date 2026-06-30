import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../api/axios";

function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const [message, setMessage] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItem(itemId, newQuantity);
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Error al actualizar cantidad",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemove = async (itemId) => {
    await removeItem(itemId);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const { data } = await api.post("/orders/");
      navigate(`/orders/${data.id}`);
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Error al procesar la compra",
      });
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Tu carrito está vacío</h2>
        <p className="text-muted">Agrega productos desde el catálogo.</p>
        <Link to="/" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Tu Carrito</h1>
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
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/products/${item.product.id}`}>
                    {item.product.name}
                  </Link>
                </td>
                <td>${Number(item.product.price).toLocaleString("es-CL")}</td>
                <td style={{ width: "150px" }}>
                  <div className="input-group input-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={item.quantity}
                      min="1"
                      max={item.product.stock}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          Math.min(
                            item.product.stock,
                            Math.max(1, Number(e.target.value))
                          )
                        )
                      }
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="fw-bold">
                  ${Number(item.subtotal).toLocaleString("es-CL")}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-active">
              <td colSpan={3} className="text-end fw-bold fs-5">
                Total:
              </td>
              <td className="fw-bold fs-5 text-primary">
                ${Number(cart.total).toLocaleString("es-CL")}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-outline-secondary">
          Seguir comprando
        </Link>
        <button
          className="btn btn-success btn-lg"
          onClick={handleCheckout}
          disabled={checkingOut}
        >
          {checkingOut ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Procesando...
            </>
          ) : (
            "Confirmar Compra"
          )}
        </button>
      </div>
    </div>
  );
}

export default Cart;
