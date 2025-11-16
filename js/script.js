function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  if (e.target.closest('.sidebar-toggle')) {
    toggleSidebar();
  }
  const logoutEl = e.target.closest('.icon.logout');
  if (logoutEl) {
    const ok = confirm('Apakah Anda yakin ingin keluar?');
    if (ok) {
      window.location.href = 'index.html';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Login page logic
  const loginBtn = document.querySelector('.btn-login');
  if (loginBtn) {
    // Ripple effect on click
    loginBtn.addEventListener('click', (ev) => {
      const rect = loginBtn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = ev.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = ev.clientY - rect.top - size / 2 + 'px';
      loginBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });

    // Prevent other buttons from doing anything
    document.querySelectorAll('button:not(.btn-login)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    });

    loginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const form = this.closest('form');
      if (!form) return;
      const emailInput = form.querySelector('input[type="email"]');
      const passInput = form.querySelector('input[type="password"]');
      const errorEl = form.querySelector('#login-error');
      
      if (errorEl) errorEl.textContent = '';
      
      const email = emailInput ? emailInput.value.trim() : '';
      const pass = passInput ? passInput.value.trim() : '';
      
      // Reset error states
      [emailInput, passInput].forEach(el => el?.classList.remove('error'));
      
      // Validation
      let isValid = true;
      const errors = [];
      
      // Check for empty fields first
      const isEmailEmpty = !email;
      const isPassEmpty = !pass;
      
      if (isEmailEmpty && isPassEmpty) {
        showError(emailInput, 'Email dan Password tidak boleh kosong');
        passInput.classList.add('error');
        isValid = false;
      } else {
        // Check individual fields if not both empty
        if (isEmailEmpty) {
          showError(emailInput, 'Email tidak boleh kosong');
          isValid = false;
        } else if (!email.includes('@')) {
          showError(emailInput, 'Email harus mengandung @');
          isValid = false;
        }
        
        if (isPassEmpty) {
          showError(passInput, 'Password tidak boleh kosong');
          isValid = false;
        } else if (pass !== '24090064') {
          showError(passInput, 'Password salah, NIM: 24090064');
          isValid = false;
        }
      }
      
      if (!isValid) {
        form.classList.remove('shake');
        // trigger reflow to restart animation
        form.offsetHeight;
        form.classList.add('shake');
        return;
      }
      
      // If validation passes
      alert('Login berhasil');
      window.location.href = 'dashboard.html';
      
      function showError(input, message) {
        if (!input) return;
        input.classList.add('error');
        if (errorEl) {
          errorEl.textContent = message;
        } else {
          alert(message);
        }
        input.addEventListener('input', function onIn() {
          input.classList.remove('error');
          if (errorEl) errorEl.textContent = '';
          input.removeEventListener('input', onIn);
        });
      }
    });

    // Inject show/hide password toggle
    const passGroup = document.querySelector('.input-group input[type="password"]')?.closest('.input-group');
    const passInput = passGroup ? passGroup.querySelector('input[type="password"]') : null;
    if (passGroup && passInput && !passGroup.querySelector('.toggle-password')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toggle-password';
      btn.setAttribute('aria-label', 'Tampilkan/Sembunyikan password');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path class="eye" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
          <circle class="pupil" cx="12" cy="12" r="3"/>
        </svg>`;
      passGroup.appendChild(btn);
      btn.addEventListener('click', () => {
        const isPwd = passInput.type === 'password';
        passInput.type = isPwd ? 'text' : 'password';
      });
    }
  }

  // Dashboard: navigate to products from button
  const viewProductsBtn = document.querySelector('.view-products');
  if (viewProductsBtn) {
    viewProductsBtn.addEventListener('click', () => {
      window.location.href = 'products.html';
    });
  }

  // Dashboard: count-up animation for card values
  const cardValues = document.querySelectorAll('.cards .value');
  if (cardValues.length) {
    // Dummy summary data (spec)
    const summary = {
      totalProducts: 120,
      totalSales: 85,
      totalRevenue: 12500000,
    };

    const targets = [summary.totalProducts, summary.totalSales, summary.totalRevenue];
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    cardValues.forEach((el, idx) => {
      const target = Number(targets[idx] || 0);
      const isRupiah = idx === 2; // Revenue card
      el.textContent = isRupiah ? formatRupiah(0) : '0';
      const duration = 1000; // ms
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const val = Math.floor(target * p);
        el.textContent = isRupiah ? formatRupiah(val) : String(val);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  const productBody = document.getElementById('productBody');
  if (!productBody) {
    return; // not on products page; stop products-specific logic
  }

  const products = [
    { id: 1, name: 'Kopi Gayo', price: 25000, stock: 50 },
    { id: 2, name: 'Teh Hitam', price: 18000, stock: 30 },
    { id: 3, name: 'Coklat Aceh', price: 30000, stock: 20 },
  ];

  const rupiah = (n) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

  // Products page logic
  let sortKey = null; // 'name' | 'price' | 'stock'
  let sortDir = 'asc'; // 'asc' | 'desc'

  function applySort() {
    if (!sortKey) return;
    const dir = sortDir === 'asc' ? 1 : -1;
    products.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string' && typeof vb === 'string') {
        return va.localeCompare(vb) * dir;
      }
      return (va - vb) * dir;
    });
  }

  function render() {
    applySort();
    productBody.innerHTML = '';
    products.forEach((p, i) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${rupiah(p.price)}</td>
        <td>${p.stock}</td>
        <td>
          <div class="actions">
            <button class="icon-btn edit" data-id="${p.id}" aria-label="Edit" title="Edit" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
            <button class="icon-btn delete" data-id="${p.id}" aria-label="Delete" title="Delete" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </td>
      `;
      productBody.appendChild(tr);
    });
  }

  // Make headers sortable
  const table = productBody.closest('table');
  const thead = table ? table.querySelector('thead') : null;
  if (thead) {
    const headerMap = [
      { el: thead.querySelector('th:nth-child(1)'), key: null }, // No
      { el: thead.querySelector('th:nth-child(2)'), key: 'name' },
      { el: thead.querySelector('th:nth-child(3)'), key: 'price' },
      { el: thead.querySelector('th:nth-child(4)'), key: 'stock' },
      { el: thead.querySelector('th:nth-child(5)'), key: null }, // Aksi
    ];
    headerMap.forEach((h) => {
      if (!h.el) return;
      if (!h.key) return; // skip non-sortable
      h.el.classList.add('sortable');
      h.el.addEventListener('click', () => {
        if (sortKey === h.key) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey = h.key;
          sortDir = 'asc';
        }
        headerMap.forEach((x) => {
          if (!x.el) return;
          x.el.classList.remove('sort-asc', 'sort-desc');
        });
        h.el.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
        render();
      });
    });
  }

  document.addEventListener('click', (e) => {
    // Ripple for icon buttons
    const iconBtn = e.target.closest('.icon-btn');
    if (iconBtn) {
      const rect = iconBtn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      iconBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    }

    const editBtn = e.target.closest('.icon-btn.edit');
    const delBtn = e.target.closest('.icon-btn.delete');
    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const item = products.find((x) => x.id === id);
      if (!item) return;
      alert(`Edit produk: ${item.name}`);
    }
    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      const idx = products.findIndex((x) => x.id === id);
      if (idx === -1) return;
      if (confirm('Yakin hapus produk ini?')) {
        products.splice(idx, 1);
        render();
      }
    }
    // Row selection (ignore clicks on action buttons)
    const row = e.target.closest('tbody tr');
    if (row && !e.target.closest('.actions')) {
      const tbody = row.parentElement;
      Array.from(tbody.children).forEach((tr) => tr.classList.remove('selected'));
      row.classList.add('selected');
    }
  });

  render();
});