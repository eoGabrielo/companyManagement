import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // mostra mensagem passada pela rota
    if (location.state && location.state.message) setMessage(location.state.message);
  }, [location.state]);

  const handleLogin = async (e) => {
  e.preventDefault(); // impede reload
    setLoading(true);
    setMessage(null);

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

        // salva token e notifica app
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.dispatchEvent(new Event('authChanged'));
        }

        // mostra sucesso e redireciona
        setMessage('Login bem-sucedido! Redirecionando para o estoque...');
        setTimeout(() => navigate('/estoque'), 1200);
      } else {
        const error = await res.text();
        setMessage('Erro ao fazer login: ' + (error || res.statusText));
        console.error('Erro ao fazer login:', error);
      }
    } catch (error) {
      setMessage('Erro na requisição: ' + error.message);
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>

        {message && <div className={styles.message}>{message}</div>}

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
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
