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

  // estados para busca / filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  // Busca a lista de produtos do backend e atualiza o estado
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

  // Envia novo produto ou atualiza um existente, depois atualiza a lista
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      // garante que nome, tipo e codigo sejam salvos em maiúsculas
      nome: (nome || '').toUpperCase(),
      descricao, // descrição livre
      tipo: (tipo || '').toUpperCase(),
      quantidade: Number(quantidade) || 0,
      codigo: (codigo || '').toUpperCase(),
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

      await fetchProdutos();

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

  // Preenche o formulário para editar o produto selecionado (exibe em CAPS onde necessário)
  function startEditing(produto) {
    setEditingId(produto._id ?? produto.id);
    setNome((produto.nome ?? '').toString().toUpperCase());
    setDescricao(produto.descricao ?? '');
    setTipo((produto.tipo ?? '').toString().toUpperCase());
    setQuantidade(Number(produto.quantidade ?? produto.estoque ?? 0));
    setCodigo((produto.codigo ?? '').toString().toUpperCase());
  }

  // Limpa o formulário e cancela a edição
  function cancelEditing() {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setTipo('');
    setQuantidade('');
    setCodigo('');
  }

  // handlers de busca / filtro
  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleFilterTipo(e) {
    setFilterTipo(e.target.value);
  }

  // tipos únicos disponíveis (para o select de filtro)
  const tiposDisponiveis = Array.from(
    new Set(lista.map((p) => (p.tipo ?? '').toString().toUpperCase()).filter(Boolean))
  );

  // aplica filtro por tipo e busca por nome (case-insensitive)
  const listaFiltrada = lista
    .filter((p) => {
      const nomeItem = (p.nome ?? '').toString().toLowerCase();
      const tipoItem = (p.tipo ?? '').toString().toUpperCase();
      const matchesTipo = !filterTipo || filterTipo === '' || tipoItem === filterTipo;
      const matchesSearch = !searchTerm || nomeItem.includes(searchTerm.toLowerCase());
      return matchesTipo && matchesSearch;
    })
    .sort((a, b) => {
      const qa = Number(a.quantidade ?? a.estoque ?? 0);
      const qb = Number(b.quantidade ?? b.estoque ?? 0);
      return qa - qb; // menor quantidade primeiro
    });

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div className={styles.formInputs}>
          <input
            name="nome"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value.toUpperCase())}
            required
            style={{ flex: '1 1 200px' }}
          />
          <select
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value.toUpperCase())}
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
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
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

        <div style={{ marginTop: 8,}}>
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            style={{ width: '100%', height: 160 }}
          />
        </div>

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEditing} style={{ marginLeft: 8, background: '#FF2C2C' }}>
              Cancelar
            </button>
          )}
          {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
        </div>
      </form>

      <div className={styles.filtros}>
        <input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.input}
        />
        <select value={filterTipo} onChange={handleFilterTipo} className={styles.select}>
          <option value="">Todos os tipos</option>
          {tiposDisponiveis.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setFilterTipo('');
          }}
          className={styles.limparButton}
        >
          Limpar
        </button>
      </div>

      <div className={styles.productList}>
        {loadingList ? (
          <div>Carregando produtos...</div>
        ) : listError ? (
          <div style={{ color: 'red' }}>{listError}</div>
        ) : listaFiltrada.length === 0 ? (
          <div>Nenhum produto encontrado.</div>
        ) : (
          listaFiltrada.map((produto) => (
            <div
              key={produto._id ?? produto.id ?? produto.codigo ?? produto.nome}
              className={styles.item}
              style={{ position: 'relative' }}
            >
              <div className={styles.imagem}>
                <h1>IMAGEM</h1>
              </div>
              <div className={styles.descricao}>
                <h3>{(produto.nome ?? '').toString()}</h3>
                <p>{produto.descricao}</p>
                <p>{(produto.tipo ?? '').toString()}</p>
              </div>
              <div className={styles.estoque}>
                {(() => {
                  const qty = Number(produto.quantidade ?? produto.estoque ?? 0);
                  return (
                    <span style={{ color: qty < 5 ? 'orange' : 'green', fontWeight: qty < 5 ? 700 : 400 }}>
                      {qty} em estoque
                    </span>
                  );
                })()}
              </div>
              <div style={{ position: 'absolute', right: 8, bottom: 8 }}>
                <button
                  type="button"
                  onClick={() => startEditing(produto)}
                  className={styles.editButton}
                >
                  EDITAR
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