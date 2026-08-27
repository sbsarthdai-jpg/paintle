(function () {
  const { templates, templateCardHTML } = window.Paintle;
  const mount = document.getElementById('popularGrid');
  if (mount) {
    const popular = [...templates].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
    mount.innerHTML = popular.map(templateCardHTML).join('');
  }
})();
