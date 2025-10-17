import React, { useState } from 'react';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // evita o recarregamento da página

    try {
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Login bem-sucedido:', data);
        // Aqui você pode redirecionar ou salvar o token, etc.
      } else {
        const error = await res.text();
        console.error('Erro ao fazer login:', error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="seu@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Senha</label>
            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
