// 라인 아이콘 세트 (stroke 1.5, 24x24 viewBox) — 외부 아이콘 라이브러리 없이 자체 제공
(function () {
  window.Paintle = window.Paintle || {};

  const icons = {
    palette: `<path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h1.5A4.5 4.5 0 0 0 21 12c0-5-4-9-9-9Z"/><circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="11" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/>`,
    search: `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
    user: `<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/>`,
    menu: `<path d="M4 6h16M4 12h16M4 18h16"/>`,
    close: `<path d="M6 6l12 12M18 6L6 18"/>`,
    brush: `<path d="M4 20c0-2 1-3.5 3-4l8.5-8.5a2.1 2.1 0 0 1 3 3L10 19c-.5 2-2 3-4 3-1 0-2-1-2-2Z"/>`,
    eraser: `<path d="M18.5 12.5 9 3 3 9l7 7"/><path d="M9 21H6l-3.5-3.5a1.5 1.5 0 0 1 0-2.1L9 9l9.5 9.5-4.5 2.5Z"/>`,
    undo: `<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-2"/>`,
    redo: `<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h2"/>`,
    trash: `<path d="M4 7h16"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>`,
    download: `<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/>`,
    save: `<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h8V4"/><path d="M8 21v-6h8v6"/>`,
    filter: `<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>`,
    chevronDown: `<path d="M6 9l6 6 6-6"/>`,
    star: `<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z"/>`,
    images: `<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-4 4-2-2-5 5"/>`,
    logout: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>`,
    pencil: `<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>`,
  };

  function icon(name, extraClass = '') {
    const body = icons[name] || '';
    return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }

  window.Paintle.icons = icons;
  window.Paintle.icon = icon;
})();
