// 더미 도안 데이터 — 실제 서비스에서는 API/DB에서 받아옴
(function () {
  window.Paintle = window.Paintle || {};

  const templates = [
    {
      id: 'flower',
      title: '봄날의 꽃',
      category: '식물',
      difficulty: '쉬움',
      popularity: 982,
      createdAt: '2026-08-20',
      src: 'assets/templates/flower.svg',
    },
    {
      id: 'cat',
      title: '동그란 고양이',
      category: '동물',
      difficulty: '쉬움',
      popularity: 1520,
      createdAt: '2026-08-24',
      src: 'assets/templates/cat.svg',
    },
    {
      id: 'house',
      title: '작은 집',
      category: '사물',
      difficulty: '보통',
      popularity: 640,
      createdAt: '2026-08-10',
      src: 'assets/templates/house.svg',
    },
    {
      id: 'star',
      title: '반짝이는 별',
      category: '자연',
      difficulty: '쉬움',
      popularity: 875,
      createdAt: '2026-08-22',
      src: 'assets/templates/star.svg',
    },
    {
      id: 'fish',
      title: '헤엄치는 물고기',
      category: '동물',
      difficulty: '보통',
      popularity: 430,
      createdAt: '2026-08-05',
      src: 'assets/templates/fish.svg',
    },
    {
      id: 'tree',
      title: '동글동글 나무',
      category: '식물',
      difficulty: '쉬움',
      popularity: 705,
      createdAt: '2026-08-18',
      src: 'assets/templates/tree.svg',
    },
  ];

  function getTemplateById(id) {
    return templates.find((t) => t.id === id);
  }

  const categories = ['전체', ...new Set(templates.map((t) => t.category))];

  window.Paintle.templates = templates;
  window.Paintle.getTemplateById = getTemplateById;
  window.Paintle.categories = categories;
})();
