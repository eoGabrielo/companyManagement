// src/components/Home.jsx
import styles from './Home.module.css';

function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>Bem-vindo ao Sistema de Estoque da Rocken</h1>
        <p className={styles.description}>
          Este sistema é responsável por organizar e gerenciar o estoque da Rocken.
          Aqui você pode cadastrar produtos, acompanhar quantidades disponíveis e manter tudo sob controle.
          Use com responsabilidade.
        </p>
        <div className={styles.decorations}>
          <span className={styles.dot} style={{ '--i': 1 }}></span>
          <span className={styles.dot} style={{ '--i': 2 }}></span>
          <span className={styles.dot} style={{ '--i': 3 }}></span>
          <span className={styles.dot} style={{ '--i': 4 }}></span>
          <span className={styles.dot} style={{ '--i': 5 }}></span>
        </div>
      </section>
    </main>
  );
}

export default Home;
