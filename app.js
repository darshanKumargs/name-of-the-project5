/* Tabs, filters, search, and booking modal (framework-free) */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalClose = modal.querySelector('.modal-close');
  const bookingForm = document.getElementById('bookingForm');
  const bikeName = document.getElementById('bikeName');
  const bikePrice = document.getElementById('bikePrice');
  const cancelBtn = document.getElementById('cancelBooking');

  // Tabs
  const tabs = Array.from(document.querySelectorAll('.tab'));
  let activeTab = 'all';
  tabs.forEach(t => t.addEventListener('click', () => {
    activateTab(t.dataset.tab);
  }));

  function activateTab(tabKey) {
    activeTab = tabKey;
    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabKey);
      t.setAttribute('aria-selected', t.dataset.tab === tabKey ? 'true' : 'false');
    });
    applyFilters();
  }

  // Modal open/close
  function openModal(name = '', price = '') {
    bikeName.value = name;
    bikePrice.value = price;
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal-panel').focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
  }

  // Bind book buttons
  document.querySelectorAll('.book, .top-pick .btn.primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.dataset.bike || btn.getAttribute('data-bike') || btn.textContent.trim();
      const price = btn.dataset.price || btn.getAttribute('data-price') || '';
      openModal(name, price);
    });
  });

  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Booking submit (demo)
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    if (!name || !phone) { alert('Please enter name and phone.'); return; }
    alert(`Thanks ${name}! Your reservation for ${bikeName.value} at ₹${bikePrice.value}/hr has been received.`);
    bookingForm.reset();
    closeModal();
  });

  // Filters & search
  const priceRange = document.getElementById('priceRange');
  const sortBy = document.getElementById('sortBy');
  const grid = document.getElementById('grid');
  const searchForm = document.getElementById('searchForm');

  function applyFilters() {
    const maxPrice = Number(priceRange?.value || 9999);
    const sort = sortBy?.value || 'popular';
    const q = (document.getElementById('q')?.value || '').toLowerCase();
    const selectedTab = activeTab; // from tabs
    const typeSelect = (document.getElementById('type')?.value || '').toLowerCase();

    const cards = Array.from(grid.querySelectorAll('.bike-card'));

    let visible = cards.filter(card => {
      const price = Number(card.dataset.price || 9999);
      const t = (card.dataset.type || '').toLowerCase();
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const matchesQ = !q || title.includes(q) || t.includes(q);
      const matchesTab = selectedTab === 'all' || t === selectedTab || (selectedTab === 'cruiser' && t === 'sport');
      const matchesTypeSelect = !typeSelect || typeSelect === '' || t === typeSelect;
      return price <= maxPrice && matchesQ && matchesTab && matchesTypeSelect;
    });

    // sort
    if (sort === 'price-asc') visible.sort((a,b) => a.dataset.price - b.dataset.price);
    if (sort === 'price-desc') visible.sort((a,b) => b.dataset.price - a.dataset.price);

    // update DOM: hide all then show visible in order
    cards.forEach(c => c.style.display = 'none');
    visible.forEach(c => { c.style.display = ''; grid.appendChild(c); });
  }

  // Event bindings
  priceRange?.addEventListener('input', applyFilters);
  sortBy?.addEventListener('change', applyFilters);
  searchForm?.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });
  document.getElementById('signupBtn')?.addEventListener('click', () => alert('Sign up demo — implement server side to register.'));

  // Keyboard support for tabs (left/right)
  let focusedTabIndex = 0;
  tabs.forEach((t, i) => {
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { focusedTabIndex = (i + 1) % tabs.length; tabs[focusedTabIndex].focus(); }
      if (e.key === 'ArrowLeft') { focusedTabIndex = (i - 1 + tabs.length) % tabs.length; tabs[focusedTabIndex].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { activateTab(t.dataset.tab); }
    });
  });

  // Initialize
  activateTab('all');
  applyFilters();
});
