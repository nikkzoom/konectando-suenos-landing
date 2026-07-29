async function loadComponent(containerId, componentPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    // Parámetro anti-caché para ver los cambios en vivo en Vercel inmediatamente
    const cacheBuster = `?v=${new Date().getTime()}`;
    const response = await fetch(`${componentPath}${cacheBuster}`);

    if (!response.ok) throw new Error(`Error al cargar ${componentPath}`);

    const htmlContent = await response.text();
    container.innerHTML = htmlContent;

    // Ejecutar los scripts internos del componente inyectado
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  } catch (error) {
    console.error(`[Cargador Modular] Error en ${containerId}:`, error);
  }
}

// Cargar el header al iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-container", "components/header.html");
});
// ... (Mantén la función loadComponent igual) ...

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-container", "components/header.html");
  loadComponent("hero-container", "components/hero.html");
  // Añade esta línea:
  loadComponent("problema-container", "components/problema.html");
});