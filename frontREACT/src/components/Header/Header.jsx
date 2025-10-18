
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";
import { useState, useEffect } from 'react';

function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // atualiza estado de autenticação
    setIsLogged(Boolean(localStorage.getItem('token')));
    const handleStorage = () => setIsLogged(Boolean(localStorage.getItem('token')));
    const handleAuthChanged = () => setIsLogged(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChanged', handleAuthChanged);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChanged', handleAuthChanged);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    // notify same-tab listeners
    window.dispatchEvent(new Event('authChanged'));
    setIsLogged(false);
    navigate('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Rocken Estoque</div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>Início</Link>
        <Link to="/estoque" className={styles.link}>Estoque</Link>
      </nav>

      {isLogged ? (
        <button className={styles.button} onClick={handleLogout}>
          Sair
        </button>
      ) : (
        <Link to="/login">
          <button className={styles.button}>Entrar</button>
        </Link>
      )}
    </header>
  );
}

export default Header;