import React, { useState } from 'react';
import styles from '../ListaProdutos/ProductList.module.css'; // reutiliza o design do ProductList

export default function Login({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Faz requisição de login ao backend
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Erro: ${res.status}`);
      }
      const data = await res.json();
      // salva token ou dados conforme backend
      if (data.token) localStorage.setItem('token', data.token);
      setEmail('');
      setSenha('');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup} role="dialog" aria-modal="true">
        <h3>Entrar</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div className={styles.popupButtons} style={{ justifyContent: 'flex-end' }}>
            <button type="button" className={styles.popupCancel} onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.popupConfirm} disabled={loading} style={{ marginLeft: 8 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}