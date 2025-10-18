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
    // If navigated here with a state message (e.g. from ProtectedRoute), show it
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault(); // evita o recarregamento da página
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

        // Salvando o token no localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Dispara evento para notificar outras partes da app no mesmo tab
          window.dispatchEvent(new Event('authChanged'));
        }

        // Mostrar mensagem de sucesso e redirecionar para /estoque
        setMessage('Login bem-sucedido! Redirecionando para o estoque...');

        // curto delay para o usuário ver a mensagem
        setTimeout(() => {
          navigate('/estoque');
        }, 1200);
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
