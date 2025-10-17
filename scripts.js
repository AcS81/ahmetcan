const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const yearEl = document.getElementById('year');

function activateTab(id) {
  tabButtons.forEach((button) => {
    const isActive = button.id === `${id}-button`;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    if (!isActive) {
      button.removeAttribute('tabindex');
    } else {
      button.setAttribute('tabindex', '0');
    }
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.id === id;
    panel.classList.toggle('active', isActive);
    if (isActive) {
      panel.removeAttribute('tabindex');
    } else {
      panel.setAttribute('tabindex', '-1');
    }
  });
}

function handleTabClick(event) {
  const button = event.currentTarget;
  const panelId = button.getAttribute('aria-controls');
  if (panelId) {
    activateTab(panelId);
  }
}

function handleTabKeydown(event) {
  const currentIndex = Array.from(tabButtons).indexOf(event.currentTarget);
  const lastIndex = tabButtons.length - 1;
  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = lastIndex;
      break;
    default:
      return;
  }

  event.preventDefault();
  tabButtons[nextIndex].focus();
  tabButtons[nextIndex].click();
}

tabButtons.forEach((button) => {
  button.addEventListener('click', handleTabClick);
  button.addEventListener('keydown', handleTabKeydown);
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
