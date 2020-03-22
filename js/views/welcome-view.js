import string from '../data/string-data';
import AbstractView from '../views/abstract-view';

export default class WelcomeView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return `
<section class="welcome">
<div class="welcome__logo"><img src="img/melody-logo.png" alt="${string.header.logo}" width="186" height="83"></div>
<button class="welcome__button" disabled><span class="visually-hidden">${string.buttons.play}</span></button>
<h2 class="welcome__rules-title">${string.welcome.title}</h2>
<p class="welcome__text">${string.welcome.rulesTitle}</p>
<ul class="welcome__rules-list">
  <li>${string.welcome.ruleOne}</li>
  <li>${string.welcome.ruleTwo}</li>
</ul>
<p class="welcome__text">${string.welcome.text}</p>
</section>
`;
  }

  play() {
    this.element.querySelector(`.welcome__button`).removeAttribute(`disabled`);
  }

  playButtonClickHandler() {}

  bind() {
    const playButton = this.element.querySelector(`.welcome__button`);

    playButton.addEventListener(`click`, () => {
      this.playButtonClickHandler();
    });
  }
}


