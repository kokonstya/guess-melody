const main = document.querySelector(`.app`).querySelector(`.main`);

export const getFragmentFromString = (str) => new DOMParser().parseFromString(str, `text/html`).body.firstChild;

export const showScreen = (screen) => {
  main.textContent = ``;
  main.appendChild(screen);
};

