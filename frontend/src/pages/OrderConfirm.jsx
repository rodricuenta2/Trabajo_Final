import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function OrderConfirm() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}/`)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="alert alert-warning">
        Orden no encontrada. <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="alert alert-success text-center p-4">
        <h2>¡Compra Confirmada!</h2>
        <p className="mb-0">
          Tu orden #<strong>{order.id}</strong> ha sido registrada exitosamente.
        </p>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Detalle de la Orden #{order.id}</h5>
        </div>
        <div className="card-body">
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(order.created_at).toLocaleString("es-CL")}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className="badge bg-warning">{order.status}</span>
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.price).toLocaleString("es-CL")}</td>
                  <td>
                    ${(item.quantity * Number(item.price)).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-active">
                <td colSpan={3} className="text-end fw-bold">
                  Total:
                </td>
                <td className="fw-bold fs-5 text-primary">
                  ${Number(order.total).toLocaleString("es-CL")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-primary">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirm;
