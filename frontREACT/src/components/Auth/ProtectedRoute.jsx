
import { Navigate, useLocation } from 'react-router-dom';

// protege rota verificando token
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: 'Você precisa logar antes para acessar essa página.',
        }}
      />
    );
  }

  return children;
}
