// Mapagino demo shell v1. Load in <head>, before the CSS: applies the saved theme before the
// first paint. A file, not an inline script, because the page CSP allows only 'self' scripts.
// The key is shared by the hub and every demo (same origin: demos.mapagino.com).
try {
  var savedTheme = localStorage.getItem("mapagino.theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (e) {}
