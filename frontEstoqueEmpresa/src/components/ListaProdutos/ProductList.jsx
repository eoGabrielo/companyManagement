// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import styles from './ProductList.module.css';

function ProductList() {
  // Cada campo com seu próprio useState
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [codigo, setCodigo] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lista, setLista] = useState([]); // produtos carregados da API
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Busca os produtos da API quando o componente monta
  useEffect(() => {
    let mounted = true;
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
        if (mounted) setLista(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        if (mounted) setListError(err.message || 'Erro ao carregar produtos');
      } finally {
        if (mounted) setLoadingList(false);
      }
    }

    fetchProdutos();
    return () => { mounted = false; };
  }, []);

  // Envia o formulário para a API ou localmente
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Monta o payload com cada valor
    const payload = {
      nome,
      descricao,
      tipo,
      quantidade: Number(quantidade) || 0,
      codigo
    };

    console.log('Payload pronto para enviar:', payload);

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
        console.log(err);
        throw new Error(err.message || `Erro: ${res.status}`);
      }

      const result = await res.json();
      if (editingId) {
        setLista(prev => prev.map(p => (p._id === result._id || p.id === result.id ? result : p)));
      } else {
        setLista(prev => [result, ...prev]);
      }

      // limpa campos e modo edição
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
    setQuantidade(String(produto.quantidade ?? produto.estoque ?? ''));
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

      {/* Formulário de criação */}
      <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div className={styles.formInputs}>

          {/* Nome do produto */}
          <input
            name="nome"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ flex: '1 1 200px' }}
          />

          {/* Tipo do produto */}
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

          {/* Código do produto */}
          <input
            name="codigo"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={{ flex: '1 1 120px' }}
          />

          {/* Quantidade */}
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

        {/* Descrição */}
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

        {/* Botão de submit e exibição de erro */}
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

      {/* Lista de produtos (vinda da API) */}
      <div className={styles.productList}>
        {loadingList ? (
          <div>Carregando produtos...</div>
        ) : listError ? (
          <div style={{ color: 'red' }}>{listError}</div>
        ) : lista.length === 0 ? (
          <div>Nenhum produto encontrado.</div>
        ) : (
          lista.map(produto => (
            <div key={produto._id || produto.id} className={styles.item} style={{ position: 'relative' }}>
              <div className={styles.imagem}>
                <img src={produto.imagem || 'https://via.placeholder.com/150'} alt={produto.nome} />
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
