// lista e CRUD de produtos
import React, { useState, useEffect } from 'react';
import styles from './ProductList.module.css';

function ProductList() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [codigo, setCodigo] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(null); // produto para confirmação de exclusão

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lista, setLista] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // estados de busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  // busca produtos da API
  async function fetchProdutos() {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch('https://companymanagement-omef.onrender.com/produtos');
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

  // cria ou atualiza produto
  async function handleSubmit(e, skipValidation = false) {
    e.preventDefault();
    setError(null);
    setLoading(true);

  // valida campos
    if (!skipValidation && !nome) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

  // monta payload
    const payload = {
      nome: (nome || '').toUpperCase(),
      descricao: descricao,
      tipo: (tipo || '').toUpperCase(),
      quantidade: Number(quantidade) || 0,
      codigo: (codigo || '').toUpperCase(),
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`https://companymanagement-omef.onrender.com/produtos/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('https://companymanagement-omef.onrender.com/produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        // extrai erro do backend
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erro: ${res.status}`);
      }

      // recarrega lista após salvar
      await fetchProdutos();

  // limpa formulário
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

  // prepara edição
  function startEditing(produto) {
    setEditingId(produto._id ?? produto.id);
    setNome((produto.nome ?? '').toString().toUpperCase());
    setDescricao(produto.descricao ?? '');
    setTipo((produto.tipo ?? '').toString().toUpperCase());
    setQuantidade(Number(produto.quantidade ?? produto.estoque ?? 0));
    setCodigo((produto.codigo ?? '').toString().toUpperCase());
  }

  // deleta produto
  const startDelete = async (produto) => {
    const idItem = produto._id ?? produto.id;

    try {
      const res = await fetch(`https://companymanagement-omef.onrender.com/produtos/${idItem}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erro ao deletar: ${res.status}`);
      }

      // recarrega lista após exclusão
      await fetchProdutos();
    } catch (err) {
      console.error("Erro ao deletar produto:", err.message);
    }
  };


  function cancelEditing() {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setTipo('');
    setQuantidade('');
    setCodigo('');
  }

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleFilterTipo(e) {
    setFilterTipo(e.target.value);
  }

  const tiposDisponiveis = Array.from(
    new Set(lista.map(p => (p.tipo ?? '').toString().toUpperCase()).filter(Boolean))
  );

  const listaFiltrada = lista
    .filter(p => {
      const nomeItem = (p.nome ?? '').toString().toLowerCase();
      const codigoItem = (p.codigo ?? '').toString().toLowerCase();
      const tipoItem = (p.tipo ?? '').toString().toUpperCase();
      const matchesTipo = !filterTipo || filterTipo === '' || tipoItem === filterTipo;
      const q = (searchTerm || '').toString().trim().toLowerCase();
      const matchesSearch = !q || nomeItem.includes(q) || codigoItem.includes(q);
      return matchesTipo && matchesSearch;
    })
    .sort((a, b) => {
      const qa = Number(a.quantidade ?? a.estoque ?? 0);
      const qb = Number(b.quantidade ?? b.estoque ?? 0);
      return qa - qb;
    });

  return (
    <div className={styles.container}>
        {/* popup de confirmação */}
      {confirmDelete && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>
              Tem certeza que deseja excluir o produto{' '}
              <strong>{confirmDelete.nome}</strong>?
            </p>
            <div className={styles.popupButtons}>
              <button
                className={styles.popupConfirm}
                onClick={async () => {
                  await startDelete(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Sim, excluir
              </button>
              <button
                className={styles.popupCancel}
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

  {/* formulário de cadastro/edição */}
  <h1 id='topForm' style={{color: '#0f2027'}}>.</h1>
      <form id='topForm' className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
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
            <option value="FONTES">FONTES</option>
            <option value="CENTRAL">CENTRAL</option>
            <option value="SENSOR">SENSOR</option>
            <option value="BOTOEIRA">BOTOEIRA</option>
            <option value="CONTROLE DE ACESSO">CONTROLE DE ACESSO</option>
            <option value="SEM PARAR">SEM PARAR</option>
            <option value="ACESSORIOS">ACESSORIOS</option>
            <option value="MOTOR">MOTOR</option>
            <option value="CABOS">CABOS</option>
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

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <button type="submit" disabled={loading}>
            {loading
              ? 'Salvando...'
              : editingId
                ? 'Salvar Alterações'
                : 'Adicionar Produto'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEditing}
              style={{ marginLeft: 8, background: '#FF2C2C' }}
            >
              Cancelar
            </button>
          )}
          {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
        </div>
      </form>

  {/* filtros */}
      <div className={styles.filtros}>
        <input
          placeholder="Buscar por nome ou código..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.input}
        />
        <select
          value={filterTipo}
          onChange={handleFilterTipo}
          className={styles.select}
        >
          <option value="">Todos os tipos</option>
          {tiposDisponiveis.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
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

  {/* lista de produtos */}
      <div className={styles.productList}>
        {loadingList ? (
          <div>Carregando produtos...</div>
        ) : listError ? (
          <div style={{ color: 'red' }}>{listError}</div>
        ) : listaFiltrada.length === 0 ? (
          <div>Nenhum produto encontrado.</div>
        ) : (
          listaFiltrada.map(produto => (
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
                <p style={{color: "#c6c6c63a", fontSize: 12, marginBottom: 0}}>CATEGORIA: {(produto.tipo ?? '').toString()}</p>
                <p style={{color: "#c6c6c63a", fontSize: 12, marginTop: 0}}>CODIGO: {(produto.codigo ?? '').toString()}</p>
              </div>
              <div className={styles.estoque}>
                {(() => {
                  const qty = Number(produto.quantidade ?? produto.estoque ?? 0);
                  return (
                    <span
                      style={{
                        color: qty < 5 ? 'orange' : 'green',
                        fontWeight: qty < 5 ? 700 : 400,
                      }}
                    >
                      {qty} em estoque
                    </span>
                  );
                })()}
              </div>
              <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', alignItems: 'center', gap: '8px', }}>
                {/* botões de ajuste de quantidade */}
                <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
                  <button
                    type="button"
                    onClick={async () => {
                      const newQty = Number(produto.quantidade ?? produto.estoque ?? 0) - 1;
                      if (newQty >= 0) {
                        await fetch(`http://localhost:3000/produtos/${produto._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          },
                          body: JSON.stringify({ ...produto, quantidade: newQty }),
                        });
                        fetchProdutos();
                      }
                    }}
                    className={styles.actionButton}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const newQty = Number(produto.quantidade ?? produto.estoque ?? 0) + 1;
                      await fetch(`https://companymanagement-omef.onrender.com/produtos/${produto._id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({ ...produto, quantidade: newQty }),
                      });
                      fetchProdutos();
                    }}
                    className={styles.actionButton}
                  >
                    ↑
                  </button>
                </div>

                {/* editar e excluir */}
                <button
                  type="button"
                  onClick={() => startEditing(produto)}
                  className={styles.actionButton}
                >
                  <a href='#topForm' style={{textDecoration: 'none', color: 'inherit'}}>Editar</a>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(produto)}
                  className={styles.actionButton}
                  style={{ background: '#FF2C2C' }}
                >
                  Excluir
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
