import React, { useState, useEffect } from 'react';
import styles from './ProductList.module.css';

function ProductList() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [codigo, setCodigo] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lista, setLista] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // ⬇️ Mover a função para fora do useEffect para poder reutilizá-la
  async function fetchProdutos() {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch('http://localhost:3000/produtos');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Erro: ${res.status}`);
      }
      const data = await res.json();
      setLista(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setListError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      nome,
      descricao,
      tipo,
      quantidade: Number(quantidade) || 0,
      codigo
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`http://localhost:3000/produtos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('http://localhost:3000/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erro: ${res.status}`);
      }

      // Atualiza a lista inteira após salvar
      await fetchProdutos();

      // Limpa o formulário
      setNome('');
      setDescricao('');
      setTipo('');
      setQuantidade('');
      setCodigo('');
      setEditingId(null);
    } catch (err) {
      console.error('Erro ao enviar produto:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function startEditing(produto) {
    setEditingId(produto._id || produto.id);
    setNome(produto.nome ?? '');
    setDescricao(produto.descricao ?? '');
    setTipo(produto.tipo ?? '');
    setQuantidade(Number(produto.quantidade ?? produto.estoque ?? 0));
    setCodigo(produto.codigo ?? '');
  }

  function cancelEditing() {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setTipo('');
    setQuantidade('');
    setCodigo('');
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div className={styles.formInputs}>
          <input
            name="nome"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ flex: '1 1 200px' }}
          />
          <select
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ flex: '1 1 150px' }}
          >
            <option value="">Selecione o tipo</option>
            <option value="TI">TI</option>
            <option value="PLACA">PLACA</option>
            <option value="MATERIAL">MATERIAL</option>
          </select>
          <input
            name="codigo"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={{ flex: '1 1 120px' }}
          />
          <input
            name="quantidade"
            type="number"
            min="0"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            style={{ width: 200 }}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEditing} style={{ marginLeft: 8 }}>
              Cancelar
            </button>
          )}
          {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
        </div>
      </form>

      <div className={styles.productList}>
        {loadingList ? (
          <div>Carregando produtos...</div>
        ) : listError ? (
          <div style={{ color: 'red' }}>{listError}</div>
        ) : lista.length === 0 ? (
          <div>Nenhum produto encontrado.</div>
        ) : (
          lista.map(produto => (
            <div
              key={produto._id ?? produto.id ?? produto.codigo ?? produto.nome}
              className={styles.item}
              style={{ position: 'relative' }}
            >
              <div className={styles.imagem}>
                <h1>IMAGEM</h1>
              </div>
              <div className={styles.descricao}>
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <p>{produto.tipo}</p>
              </div>
              <div className={styles.estoque}>
                <span>{produto.quantidade ?? produto.estoque ?? 0} em estoque</span>
              </div>
              <div style={{ position: 'absolute', right: 8, bottom: 8 }}>
                <button
                  type="button"
                  onClick={() => startEditing(produto)}
                  className={styles.editButton}
                >
                  EDITA
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
