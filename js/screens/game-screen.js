import {showScreen} from "../render";
import ArtistView from "../views/artist-view";
import GenreView from "../views/genre-view";
import FailView from '../views/fail-view';
import WinView from '../views/win-view';
import Router from '../router';
import ConfirmView from '../views/confirm-view';
import HeaderView from '../views/header-view';

const ONE_SECOND = 1000;

const ScreenView = {
  artist: ArtistView,
  genre: GenreView
};

export default class GameScreen {
  constructor(model) {
    this.model = model;
    this.screen = new ScreenView[this.model.screenQuestion().type](this.model.state, this.model.screenQuestion());
    this.confirmView = new ConfirmView();
    this.headerView = new HeaderView(this.model.state);
    this.screen.element.insertBefore(this.headerView.element, this.screen.element.firstChild);
    this.bind();
  }

  get element() {
    this.startTimer();
    return this.screen.element;
  }

  showNextGame() {
    this.model.changeLevel();
    showScreen(new GameScreen(this.model).element);
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.model.tick();
      this.updateHeader();
      this.startTimer();
      if (this.model.fail()) {
        this.stopTimer();
        Router.showResult(new FailView(this.model.state));
      }
    }, ONE_SECOND);
  }

  stopTimer() {
    clearTimeout(this.timer);
  }

  updateHeader() {
    this.headerView = new HeaderView(this.model.state);
    this.screen.element.replaceChild(this.headerView.element, this.screen.element.firstChild);
  }

  showModal() {
    this.confirmView.showModal();
    this.confirmView.confirmButtonClickHandler = () => {
      this.stopTimer();
      Router.start();
      this.confirmView.closeModal();
    };
    this.confirmView.closeModalClickHandler = () => {
      this.confirmView.closeModal();
    };
  }

  bind() {
    this.screen.answerButtonClickHandler = (answer) => {
      this.stopTimer();
      this.model.getAnswers(answer);

      if (this.model.fail()) {
        Router.showResult(new FailView(this.model.state));
      } else if (this.model.win()) {
        Router.showResult(new WinView(this.model.state));
      } else {
        this.showNextGame();
      }
      this.updateHeader();
    };

    this.screen.replayButtonClickHandler = () => {
      this.showModal();
    };

  }
}
