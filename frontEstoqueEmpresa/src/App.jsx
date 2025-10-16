import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ListaProdutos/ProductList';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/estoque" element={<ProductList />} />
        <Route path="/" element={<Home />} />

        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
