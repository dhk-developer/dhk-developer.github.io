// Progressive enhancement only. Without JavaScript every project is listed and
// the filter controls stay hidden.
(function () {
  const form = document.querySelector("[data-lens-filter]");
  const list = document.querySelector("[data-lens-list]");
  const status = document.querySelector("[data-lens-status]");
  if (!form || !list) return;
  form.hidden = false;

  const rows = Array.from(list.querySelectorAll("[data-lenses]"));
  const apply = (lens) => {
    let shown = 0;
    rows.forEach((row) => {
      const match = lens === "all" || row.dataset.lenses.split(" ").includes(lens);
      row.hidden = !match;
      if (match) shown += 1;
    });
    if (status) status.textContent = `${shown} ${shown === 1 ? "project" : "projects"} shown.`;
    const url = new URL(window.location.href);
    if (lens === "all") url.searchParams.delete("lens");
    else url.searchParams.set("lens", lens);
    window.history.replaceState(null, "", url);
  };

  form.addEventListener("change", (event) => {
    if (event.target && event.target.name === "lens") apply(event.target.value);
  });

  const initial = new URLSearchParams(window.location.search).get("lens");
  const input = initial && form.querySelector(`input[value="${CSS.escape(initial)}"]`);
  if (input) {
    input.checked = true;
    apply(initial);
  }
})();
