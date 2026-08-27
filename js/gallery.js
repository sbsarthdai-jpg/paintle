(function () {
  const { templates, categories, templateCardHTML, icon } = window.Paintle;

  const main = document.getElementById('galleryMain');

  main.innerHTML = `
    <div class="section-head">
      <h1>도안 갤러리</h1>
    </div>

    <a href="color.html?id=blank" class="sketchbook-banner">
      <div class="sketchbook-banner-text">
        <strong>${icon('pencil')}빈 스케치북</strong>
        <span>도안 없이 마우스로 자유롭게 낙서해보세요</span>
      </div>
      <span class="btn btn-outline btn-sm">시작하기</span>
    </a>

    <div class="gallery-controls">
      <div class="input-with-icon search-box">
        ${icon('search')}
        <input type="text" id="searchInput" class="input" placeholder="도안 이름으로 검색" />
      </div>
      <div class="filter-row" id="categoryChips"></div>
      <select id="sortSelect" class="input sort-select">
        <option value="popular">인기순</option>
        <option value="new">최신순</option>
        <option value="name">이름순</option>
      </select>
    </div>

    <p class="gallery-result-count" id="resultCount"></p>
    <div class="template-grid" id="galleryGrid"></div>
    <div class="empty-state" id="galleryEmpty" hidden>
      ${icon('search')}
      <p>검색 결과가 없어요. 다른 키워드나 카테고리를 시도해보세요.</p>
    </div>
  `;

  const chipsMount = document.getElementById('categoryChips');
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');
  const resultCount = document.getElementById('resultCount');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  const state = { query: '', category: '전체', sort: 'popular' };

  chipsMount.innerHTML = categories
    .map((c) => `<button class="chip ${c === state.category ? 'active' : ''}" data-category="${c}">${c}</button>`)
    .join('');

  function getFiltered() {
    let list = templates.filter((t) => {
      const matchCategory = state.category === '전체' || t.category === state.category;
      const matchQuery = t.title.toLowerCase().includes(state.query.trim().toLowerCase());
      return matchCategory && matchQuery;
    });

    if (state.sort === 'popular') {
      list = [...list].sort((a, b) => b.popularity - a.popularity);
    } else if (state.sort === 'new') {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (state.sort === 'name') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    }

    return list;
  }

  function render() {
    const list = getFiltered();
    resultCount.textContent = `총 ${list.length}개의 도안`;
    grid.hidden = list.length === 0;
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(templateCardHTML).join('');
  }

  chipsMount.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.category = btn.dataset.category;
    chipsMount.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === btn));
    render();
  });

  searchInput.addEventListener('input', (e) => {
    state.query = e.target.value;
    render();
  });

  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  render();
})();
