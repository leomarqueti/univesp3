// base_static/global/js/app.js

const API_BASE = '/api/';

function getCSRFToken() {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.getAttribute('content') : '';
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.replace(/\/$/, '');
  
  // Inicializar página de produtos
  if (path === '/products') {
    setupProducts();
  }
  
  // Inicializar validação de formulário de registro
  if (path === '/register') {
    setupRegisterValidation();
  }
});

// Função para validar o formulário de registro
function setupRegisterValidation() {
  const form = document.querySelector('form');
  const password1 = document.getElementById('password1');
  const password2 = document.getElementById('password2');
  
  form.addEventListener('submit', (e) => {
    if (password1.value !== password2.value) {
      e.preventDefault();
      const errorDiv = document.createElement('div');
      errorDiv.id = 'login-message';
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = '<i class="error-icon">!</i><span>As senhas não coincidem</span>';
      
      // Remover mensagem de erro anterior se existir
      const existingError = document.getElementById('login-message');
      if (existingError) {
        existingError.remove();
      }
      
      form.after(errorDiv);
      password2.focus();
    }
  });
}

async function setupProducts() {
  const tableBody = document.querySelector('#products-table tbody');
  const form = document.getElementById('product-form');
  const formTitle = document.getElementById('form-title');
  const selectType = form.elements['type_id'];
  const selectUm = form.elements['um_id'];
  const refreshBtn = document.getElementById('btn-refresh');
  const cancelBtn = document.getElementById('btn-cancel');
  const msg = document.getElementById('product-message');
  let editingId = null;

  // Função para mostrar mensagem de carregamento
  function showLoading(element, message = 'Carregando...') {
    element.innerHTML = `<div class="loading-spinner"></div> ${message}`;
  }

  // Função para mostrar mensagem de erro
  function showError(element, message) {
    element.innerHTML = `<div class="error-message"><i class="error-icon">!</i> ${message}</div>`;
    setTimeout(() => {
      element.innerHTML = '';
    }, 5000);
  }

  // Função para mostrar mensagem de sucesso
  function showSuccess(element, message) {
    element.innerHTML = `<div class="success-message"><i class="success-icon">✓</i> ${message}</div>`;
    setTimeout(() => {
      element.innerHTML = '';
    }, 3000);
  }

  async function loadSelects() {
    try {
      showLoading(selectType);
      showLoading(selectUm);
      
      const [r1, r2] = await Promise.all([
        fetch(`${API_BASE}tipo/`),
        fetch(`${API_BASE}medida/`)
      ]);
      
      if (!r1.ok || !r2.ok) throw new Error(`Status ${r1.status}/${r2.status}`);
      
      const [tipos, ums] = await Promise.all([r1.json(), r2.json()]);
      
      selectType.innerHTML = tipos.map(t => 
        `<option value="${t.id}">${t.name}</option>`
      ).join('');
      
      selectUm.innerHTML = ums.map(u => 
        `<option value="${u.id}">${u.name_abv}</option>`
      ).join('');
    } catch (err) {
      console.error('Erro loadSelects:', err);
      selectType.innerHTML = '<option value="">Erro ao carregar</option>';
      selectUm.innerHTML = '<option value="">Erro ao carregar</option>';
      showError(msg, 'Erro ao carregar tipos e unidades de medida');
    }
  }

  async function loadProducts() {
    try {
      showLoading(tableBody, '');
      
      const res = await fetch(`${API_BASE}estoque/`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const data = await res.json();
      
      if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-table">Nenhum produto cadastrado</td></tr>';
        return;
      }
      
      tableBody.innerHTML = '';
      
      data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.description || '-'}</td>
          <td>${p.stock}</td>
          <td>${p.type.name}</td>
          <td>R$ ${p.value.toFixed(2).replace('.', ',')}</td>
          <td>${p.um.name_abv}</td>
          <td class="actions-cell">
            <button data-id="${p.id}" class="edit-btn" title="Editar produto">
              <i class="icon-edit">✏️</i>
            </button>
            <button data-id="${p.id}" class="delete-btn" title="Excluir produto">
              <i class="icon-delete">🗑️</i>
            </button>
          </td>`;
        tableBody.appendChild(tr);
      });

      tableBody.querySelectorAll('.edit-btn')
        .forEach(b => b.addEventListener('click', () => editProduct(b.dataset.id)));

      tableBody.querySelectorAll('.delete-btn')
        .forEach(b => b.addEventListener('click', () => deleteProduct(b.dataset.id)));
        
      showSuccess(msg, 'Produtos carregados com sucesso!');
    } catch (err) {
      console.error('Erro loadProducts:', err);
      tableBody.innerHTML = '<tr><td colspan="8" class="empty-table error-text">Erro ao carregar produtos</td></tr>';
      showError(msg, 'Erro ao carregar produtos');
    }
  }

  async function saveProduct() {
    msg.textContent = '';
    
    try {
      const fd = new FormData(form);
      const payload = {
        name: fd.get('name'),
        description: fd.get('description'),
        stock: +fd.get('stock'),
        type_id: +fd.get('type_id'),
        value: +fd.get('value'),
        um_id: +fd.get('um_id'),
      };
      
      const url = editingId ? `${API_BASE}estoque/${editingId}/` : `${API_BASE}estoque/`;
      const method = editingId ? 'PUT' : 'POST';
      
      showLoading(msg, editingId ? 'Atualizando produto...' : 'Salvando produto...');

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw errorData;
      }
      
      form.reset();
      editingId = null;
      formTitle.textContent = 'Cadastrar Novo Produto';
      cancelBtn.style.display = 'none';
      
      showSuccess(msg, editingId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
      
      await loadProducts();
    } catch (err) {
      console.error('Erro saveProduct:', err);
      showError(msg, `Erro: ${JSON.stringify(err)}`);
    }
  }

  async function editProduct(id) {
    msg.textContent = '';
    
    try {
      showLoading(msg, 'Carregando produto...');
      
      const res = await fetch(`${API_BASE}estoque/${id}/`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const p = await res.json();
      
      form.elements['name'].value = p.name;
      form.elements['description'].value = p.description || '';
      form.elements['stock'].value = p.stock;
      form.elements['type_id'].value = p.type.id;
      form.elements['value'].value = p.value;
      form.elements['um_id'].value = p.um.id;
      
      editingId = id;
      formTitle.textContent = `Editar Produto #${id}`;
      cancelBtn.style.display = 'inline-block';
      
      // Scroll para o formulário
      form.scrollIntoView({ behavior: 'smooth' });
      
      msg.textContent = '';
    } catch (err) {
      console.error('Erro editProduct:', err);
      showError(msg, 'Erro ao buscar produto');
    }
  }

  async function deleteProduct(id) {
    msg.textContent = '';
    
    if (!confirm(`Tem certeza que deseja excluir o produto #${id}?`)) return;
    
    try {
      showLoading(msg, 'Excluindo produto...');
      
      const res = await fetch(`${API_BASE}estoque/${id}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      });
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      showSuccess(msg, 'Produto excluído com sucesso!');
      
      await loadProducts();
    } catch (err) {
      console.error('Erro deleteProduct:', err);
      showError(msg, 'Erro ao excluir produto');
    }
  }

  // Inicializar eventos
  cancelBtn.addEventListener('click', () => {
    form.reset();
    editingId = null;
    formTitle.textContent = 'Cadastrar Novo Produto';
    cancelBtn.style.display = 'none';
    msg.textContent = '';
  });

  // Carregar dados iniciais
  await loadSelects();
  await loadProducts();
  
  // Configurar eventos
  refreshBtn.addEventListener('click', loadProducts);
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    saveProduct();
  });
}
