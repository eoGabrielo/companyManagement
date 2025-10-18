
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";
import { useState, useEffect } from 'react';

function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogged(Boolean(localStorage.getItem('token')));

    // also listen to storage events in case another tab logs out/logs in
    const handleStorage = () => setIsLogged(Boolean(localStorage.getItem('token')));
    const handleAuthChanged = () => setIsLogged(Boolean(localStorage.getItem('token')));

    window.addEventListener('storage', handleStorage);
    // listen to custom event for same-tab updates
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