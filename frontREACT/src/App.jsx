import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ListaProdutos/ProductList';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route
        path="/estoque"
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
}

export default App;
