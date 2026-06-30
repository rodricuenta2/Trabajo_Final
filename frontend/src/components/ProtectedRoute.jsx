import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_staff) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
