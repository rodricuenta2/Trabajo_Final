import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    available: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api
        .get(`/admin/products/${id}/`)
        .then(({ data }) =>
          setForm({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            available: data.available,
          })
        )
        .catch(() => navigate("/admin/products"));
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (payload.price <= 0) {
      setError("El precio debe ser mayor a 0");
      setLoading(false);
      return;
    }
    if (payload.stock < 0) {
      setError("El stock no puede ser negativo");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/admin/products/${id}/`, payload);
      } else {
        await api.post("/admin/products/", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const msgs = Object.values(errors).flat();
        setError(msgs.join(". "));
      } else {
        setError("Error al guardar el producto");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2>{isEditing ? "Editar Producto" : "Nuevo Producto"}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Precio *</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="available"
                  checked={form.available}
                  onChange={(e) =>
                    setForm({ ...form, available: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="available">
                  Producto disponible
                </label>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : isEditing
                    ? "Actualizar"
                    : "Crear Producto"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
