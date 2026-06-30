import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const msgs = Object.values(errors).flat();
        setError(msgs.join(". "));
      } else {
        setError("Error al registrarse");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Registrarse</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={form.password2}
                  onChange={(e) =>
                    setForm({ ...form, password2: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </form>
            <p className="text-center mt-3">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
