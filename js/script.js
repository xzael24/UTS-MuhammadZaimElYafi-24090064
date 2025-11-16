// Shared scripts for Dashboard and Products

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

// Global: handle sidebar toggle via delegation (works on all pages)
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

// Products page logic (runs only if elements exist)
document.addEventListener('DOMContentLoaded', () => {
  const productBody = document.getElementById('productBody');
  if (!productBody) return; // not on products page

  // Dummy data
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

  function render() {
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

  document.addEventListener('click', (e) => {
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
  });

  render();
});