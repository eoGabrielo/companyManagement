import React from 'react';
import styles from './Login.module.css';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>
        <form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <input className={styles.input} id="email" type="email" placeholder="seu@exemplo.com" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Senha</label>
            <input className={styles.input} id="password" type="password" placeholder="••••••••" />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              <a href="">Entrar</a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}