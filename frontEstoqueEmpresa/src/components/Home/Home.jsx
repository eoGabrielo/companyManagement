// src/components/Home.jsx
import styles from './Home.module.css';

function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>Bem-vindo ao Sistema de Cadastro de Produtos</h1>
        <p className={styles.description}>
          Aqui você pode gerenciar seu estoque com facilidade, cadastrar novos produtos,
          acompanhar quantidades disponíveis e manter seu negócio sempre organizado.
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
