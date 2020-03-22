import {initialState} from '../data/game-data';
import WelcomeView from '../views/welcome-view';
import Router from '../router';

export default class WelcomeScreen {
  constructor() {
    this.screen = new WelcomeView(initialState);
    this.bind();
  }

  get element() {
    return this.screen.element;
  }

  bind() {
    this.screen.playButtonClickHandler = () => Router.showGame();
  }
}

