import string from '../data/string-data';
import {showResults} from '../game/show-results';
import AbstractView from '../views/abstract-view';
import {initialState} from '../data/game-data';

export default class FailView extends AbstractView {
  constructor(state) {
    super();
    this.state = state;

    this.result = {
      userPoint: null,
      time: initialState.time - this.state.time,
      lives: this.state.lives
    };
    this.replica = this.state.lives <= 0 ? `${string.result.loseReplica}` : `${string.result.timeLoseReplica}`;
  }

  get template() {
    return `
<section class="result">
<div class="result__logo"><img src="img/melody-logo.png" alt="${string.header.logo}" width="186" height="83"></div>
<h2 class="result__title">${this.replica}</h2>
<p class="result__total result__total--fail">${showResults([], this.result)}</p>
<button class="result__replay" type="button">${string.buttons.loseReplay}</button>
</section>
`;
  }

  replayButtonClickHandler() {}

  bind() {
    this.element.querySelector(`.result__replay`).addEventListener(`click`, () => {
      this.replayButtonClickHandler();
    });
  }
}

