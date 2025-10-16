
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Sua Logo</div>
      <nav className={styles.nav}>
        <a href="/" className={styles.link}>Início</a>
        <a href="/estoque" className={styles.link}>Estoque</a>
        <a href="/nota" className={styles.link}>Nota</a>
      </nav>
      <button className={styles.button}>Entrar</button>
    </header>
  );
}

export default Header;