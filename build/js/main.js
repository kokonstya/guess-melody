(function () {
  'use strict';

  const main = document.querySelector(`.app`).querySelector(`.main`);

  const getFragmentFromString = (str) => new DOMParser().parseFromString(str, `text/html`).body.firstChild;

  const showScreen = (screen) => {
    main.textContent = ``;
    main.appendChild(screen);
  };

  const Time = {
    FAST: 30,
    MAX: 300
  };

  const MAX_QUESTIONS = 10;

  const initialState = Object.freeze({
    time: Time.MAX,
    lives: 3,
    questions: [],
    level: 0,
    answers: []
  });

  var string = Object.freeze({
    header: {
      logo: `Угадай мелодию`,
    },
    welcome: {
      title: `Правила игры`,
      rulesTitle: `Правила просты:`,
      ruleOne: `За 5 минут нужно ответить на все вопросы.`,
      ruleTwo: `Можно допустить 3 ошибки.`,
      text: `Удачи!`
    },
    artist: {
      question: `Кто исполняет эту песню?`,
    },
    modal: {
      title: `Подтверждение`,
      confirm: `Вы уверены что хотите начать игру заново?`
    },
    modalError: {
      title: `Произошла ошибка!`,
      status: `Статус:`,
      text: `Пожалуйста, перезагрузите страницу.`
    },
    result: {
      win: `Вы настоящий меломан!`,
      loseReplica: `Какая жалость!`,
      timeLoseReplica: `Увы и ах!`,
      loseStat: `У вас закончились все попытки. Ничего, повезёт в следующий раз!`,
      timeLose: `Время вышло! Вы не успели отгадать все мелодии`,
    },
    buttons: {
      play: `Начать игру`,
      replay: `Сыграть ещё раз`,
      loseReplay: `Попробовать ещё раз`,
      answerSend: `Ответить`,
      modalClose: `Закрыть`,
      modalConfirm: `Ок`,
      modalReject: `Отмена`
    }
  });

  class AbstractView {
    constructor() {
      if (new.target === AbstractView) {
        throw new Error(`Can't instantiate AbstractView, only concrete one`);
      }
    }

    get template() {
      throw new Error(`Template is required`);
    }

    get element() {
      if (this._element) {
        return this._element;
      }
      this._element = this.render();
      this.bind(this._element);
      return this._element;
    }

    render() {
      return getFragmentFromString(this.template);
    }

    bind() {}
  }

  class WelcomeView extends AbstractView {
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

  class WelcomeScreen {
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

  const getGenrePlayer = (src) => `
<div class="track">
  <button class="track__button track__button--play" type="button"></button>
  <div class="track__status">
  <audio src="${src}" preload="auto"></audio>
</div>`;

  const getArtistPlayer = (src) => `
<div class="game__track">
  <button class="track__button track__button--play" type="button"></button>
  <audio src="${src}" preload="auto"></audio>
</div>`;

  const playTrack = (tracks) => {
    const audios = Array.from(tracks.map((item) => item.querySelector(`audio`)));
    const buttons = Array.from(tracks.map((item) => item.querySelector(`button`)));

    const stopAll = () => {
      buttons.forEach((button, index) => {
        if (button.classList.contains(`track__button--pause`)) {
          stopAudio(index);
        }
      });
    };

    const stopAudio = (index) => {
      buttons[index].classList.replace(`track__button--pause`, `track__button--play`);
      audios[index].pause();
    };

    const playAudio = (index) => {
      buttons[index].classList.replace(`track__button--play`, `track__button--pause`);
      audios[index].play();
    };

    buttons[0].classList.replace(`track__button--play`, `track__button--pause`);
    audios[0].setAttribute(`autoplay`, true);

    const playAudioHandler = (evt, index) => {
      if (evt.target.classList.contains(`track__button--play`)) {
        stopAll();
        playAudio(index);
      } else {
        stopAudio(index);
      }
    };

    buttons.forEach((item, index) => {
      item.addEventListener(`click`, (evt) => playAudioHandler(evt, index));
    });
  };

  const DEBUG = new URLSearchParams(location.search).has(`debug`);
  const DEBUG_STYLE = `style="color:red;"`;

  class ArtistView extends AbstractView {
    constructor(state, questions) {
      super();
      this.state = state;
      this.questions = questions;
    }

    get template() {
      return `
    <section class="game game--artist">
        <section class="game__screen">
          <h2 class="game__title">${this.questions.question}</h2>
          ${getArtistPlayer(this.questions.src)}
          <form class="game__artist">
          ${[...Object.entries(this.questions.answers)].map(([value, answer], i) => {
    return `<div class="artist">
            <input class="artist__input visually-hidden" type="radio" name="answer" value="${value}" id="answer-${i + 1}">
            <label class="artist__name" ${DEBUG && answer.correct ? DEBUG_STYLE : ``} for="answer-${i + 1}">
              <img class="artist__picture" src="${answer.song.image}" alt="${answer.song.name}">
              ${answer.song.name}
            </label>
          </div>`;
  }
  ).join(``)}
          </form>
        </section>
      </section>`;
    }

    answerButtonClickHandler() {}

    replayButtonClickHandler() {}

    bind() {
      const form = this.element.querySelector(`.game__artist`);
      const answerButton = Array.from(form.querySelectorAll(`.artist__input`));
      const tracks = Array.from(this.element.querySelectorAll(`.game__track`));

      answerButton.forEach((item) => {
        item.addEventListener(`click`, () => {
          const checkedAnswer = answerButton.filter((input) => input.checked).map((element) => element.value);
          this.answerButtonClickHandler(checkedAnswer);
        });
      });

      playTrack(tracks);

      this.element.addEventListener(`click`, (evt) => {
        if (evt.target.classList.contains(`game__back`) || evt.target.classList.contains(`game__logo`)) {
          evt.preventDefault();
          this.replayButtonClickHandler();
        }
      });
    }
  }

  const DEBUG$1 = new URLSearchParams(location.search).has(`debug`);
  const DEBUG_STYLE$1 = `style="border:1px solid red;"`;

  class GenreView extends AbstractView {
    constructor(state, questions) {
      super();
      this.state = state;
      this.questions = questions;
    }

    get template() {
      return `
    <section class="game game--genre">
    <section class="game__screen">
      <h2 class="game__title">${this.questions.question}</h2>
      <form class="game__tracks">
      ${[...Object.entries(this.questions.answers)].map(([id, answer]) =>{
    return `${getGenrePlayer(answer.song.src)}
      <div class="game__answer">
            <input class="game__input visually-hidden" type="checkbox" name="answer" value="answer-1" id="${id}">
            <label class="game__check" ${DEBUG$1 && answer.correct ? DEBUG_STYLE$1 : ``} for="${id}">Отметить</label>
          </div>
          </div>`
    ;
  }).join(` `)}
        <button class="game__submit button" type="submit">${string.buttons.answerSend}</button>
      </form>
    </section>
  </section>
  `;
    }

    answerButtonClickHandler() {}

    replayButtonClickHandler() {}

    bind() {
      const form = this.element.querySelector(`.game__tracks`);
      const answers = Array.from(form.querySelectorAll(`input`));
      const answerButton = form.querySelector(`.game__submit`);
      const tracks = Array.from(this.element.querySelectorAll(`.track`));

      answerButton.disabled = true;

      const answersChangeHandler = () => {
        answerButton.disabled = !answers.some((element) => element.checked);
      };

      answers.forEach((item) => {
        item.addEventListener(`change`, answersChangeHandler);
      });

      answerButton.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const checkedAnswer = answers.filter((input) => input.checked).map((element) => element.id);
        this.answerButtonClickHandler(checkedAnswer);
      });

      playTrack(tracks);

      this.element.addEventListener(`click`, (evt) => {
        if (evt.target.classList.contains(`game__back`) || evt.target.classList.contains(`game__logo`)) {
          evt.preventDefault();
          this.replayButtonClickHandler();
        }
      });

    }
  }

  const showResults = (statistics, gameResult) => {
    if (gameResult.time >= Time.MAX) {
      return `${string.result.timeLose}`;
    }
    if (gameResult.lives <= 0) {
      return `${string.result.loseStat}`;
    }
    const userPoints = gameResult.userPoint;
    const points = statistics.map((item) => item.userPoint);
    points.push(userPoints);
    points.sort((a, b) => b - a);
    const players = points.length;
    const place = points.indexOf(userPoints) + 1;
    const rate = Math.floor((players - place) / players * 100);

    return `Вы заняли ${place} место из ${players} игроков. Это лучше, чем у ${rate}% игроков`;
  };

  class FailView extends AbstractView {
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

  const Points = {
    LOOSE: -1,
    DEFAULT: 1,
    FAST: 2,
    WRONG: -2
  };

  const calculatePoints = (state) => {
    let points = 0;
    let pointFast = 0;
    if (state.answers.length < MAX_QUESTIONS) {
      return Points.LOOSE;
    }
    state.answers.forEach((answer) => {
      if (answer.correct) {
        points += answer.time >= Time.FAST ? Points.DEFAULT : Points.FAST;
        pointFast += answer.time >= Time.FAST ? 0 : Points.FAST;
      } else {
        points += Points.WRONG;
        pointFast += pointFast > 0 ? Points.WRONG : 0;
      }
    });

    return {points, pointFast};
  };

  const Dictionary = {
    min: [`минуту`, `минуты`, `минут`],
    sec: [`секунду`, `секунды`, `секунд`],
    note: [`ошибку`, `ошибки`, `ошибок`],
    point: [`балл`, `балла`, `баллов`],
    fast: [`быстрый`, `быстрых`, `быстрых`],
  };

  const formatWord = (number, item) => {
    const words = Dictionary[item];
    if ((number === 1) || (number > 20 && number % 10 === 1)) {
      return words[0];
    } else if ((number >= 2 && number <= 4) || (number > 20 && number % 10 >= 2 && number % 10 <= 4)) {
      return words[1];
    } else {
      return words[2];
    }
  };

  class WinView extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
      const {points, pointFast} = calculatePoints(this.state);
      this.points = points;
      this.pointFast = pointFast;
      this.result = {
        userPoint: points,
        time: initialState.time - state.time,
        lives: state.lives
      };
      this.min = Math.floor(this.result.time / 60);
      this.sec = Math.floor(this.result.time % 60);
    }

    get template() {
      return `
  <section class="result">
  <div class="result__logo"><img src="img/melody-logo.png" alt="${string.header.logo}" width="186" height="83"></div>
  <h2 class="result__title">${string.result.win}</h2>
  <p class="result__total">За 0${this.min}&#160${formatWord((this.min), `min`)} и ${this.sec}&#160${formatWord((this.sec), `sec`)} вы набрали ${this.points}&#160${formatWord(this.points, `point`)} (${this.pointFast}&#160${formatWord(this.pointFast, `fast`)}), совершив ${initialState.lives - this.result.lives}&#160${formatWord(initialState.lives - this.result.lives, `note`)}</p>
  <p class="result__text"></p>
  <button class="result__replay" type="button">${string.buttons.replay}</button>
</section>
`;
    }

    replayButtonClickHandler() {}

    showStats(results) {
      const stats = this.element.querySelector(`.result__text`);
      stats.textContent = showResults(results, this.result);
    }

    bind() {
      this.element.querySelector(`.result__replay`).addEventListener(`click`, () => {
        this.replayButtonClickHandler();
      });
    }

  }

  class ConfirmView extends AbstractView {
    constructor() {
      super();
    }

    get template() {
      return `
      <section class="modal">
    <button class="modal__close" type="button"><span class="visually-hidden">${string.buttons.modalClose}</span></button>
    <h2 class="modal__title">${string.modal.title}</h2>
    <p class="modal__text">${string.modal.confirm}</p>
    <div class="modal__buttons">
      <button class="modal__button button">${string.buttons.modalConfirm}</button>
      <button class="modal__button button">${string.buttons.modalReject}</button>
    </div>
  </section>
    `;
    }

    showModal() {
      document.body.appendChild(this.element);
    }

    closeModal() {
      document.body.removeChild(document.body.lastElementChild);
    }

    confirmButtonClickHandler() {}

    closeModalClickHandler() {}

    bind() {
      const [confirmButton, cancelButton] = Array.from(this.element.querySelector(`.modal__buttons`).querySelectorAll(`button`));
      const closeButton = this.element.querySelector(`.modal__close`);

      confirmButton.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.confirmButtonClickHandler();
      });

      cancelButton.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.closeModalClickHandler();
      });

      closeButton.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.closeModalClickHandler();
      });
    }
  }

  const getRadius = (radius, time) => {
    const stroke = Math.floor(2 * Math.PI * radius);
    const offset = stroke - Math.floor((time / Time.MAX) * stroke);

    return {stroke, offset};
  };

  const FINISHED = 30;
  const RADIUS = 370;

  class HeaderView extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
      this.min = Math.floor(this.state.time / 60);
      this.sec = Math.floor(this.state.time % 60);
      this.line = getRadius(RADIUS, this.state.time);
    }

    get template() {
      return `
    <header class="game__header">
    <a class="game__back" href="#">
      <span class="visually-hidden">${string.buttons.replay}</span>
      <img class="game__logo" src="img/melody-logo-ginger.png" alt="${string.header.logo}">
    </a>
    <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
      <circle class="timer__line" cx="390" cy="390" r="${RADIUS}"
              style="filter: url(#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"
              stroke-dasharray="${this.line.stroke}" stroke-dashoffset="${this.line.offset}"/>
    </svg>
    <div class="timer__value ${this.state.time < FINISHED ? `timer__value--finished` : ``}" xmlns="http://www.w3.org/1999/xhtml">
      <span class="timer__mins">0${this.min}</span>
      <span class="timer__dots">:</span>
      <span class="timer__secs">${(this.sec < 10) ? `0${this.sec}` : this.sec}</span>
    </div>
    <div class="game__mistakes">
    ${`<div class="wrong"></div>`.repeat(initialState.lives - this.state.lives)}
    </div>
    </header>
    `;
    }

  }

  const ONE_SECOND = 1000;

  const ScreenView = {
    artist: ArtistView,
    genre: GenreView
  };

  class GameScreen {
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

  const getScreenQuestion = (state) => state.questions[state.level];

  class GameModel {
    constructor() {
      this.restart();
    }

    get state() {
      return this._state;
    }

    screenQuestion() {
      return getScreenQuestion(this._state);
    }

    changeLevel() {
      return this._state.level++;
    }

    restart() {
      this._state = Object.assign({}, initialState, {answers: []});
    }

    fail() {
      return this._state.lives === 0 || this._state.time <= 0;
    }

    win() {
      return this._state.answers.length === this._state.questions.length;
    }

    getAnswerTime() {
      return initialState.time - this._state.time;
    }

    getAnswers(answer) {
      const correct = Object.keys(this.screenQuestion().answers).every((key) => this.screenQuestion().answers[key].correct === answer.includes(key));
      if (!correct) {
        this._state.lives--;
      }
      this._state.answers.push({correct, time: this.getAnswerTime()});
    }

    tick() {
      this._state.time--;
    }

  }

  class ErrorView extends AbstractView {
    constructor(error) {
      super();
      this.error = error;
    }

    get template() {
      return `
    <section class="modal">
    <h2 class="modal__title">${string.modalError.title}</h2>
    <p class="modal__text">${string.modalError.status}&#160${this.error.message}.${string.modalError.text}</p>
  </section>`;
    }

    showModal() {
      document.body.appendChild(this.element);
    }

    bind() {
      const removeErrorMessageHandler = () => {
        document.body.removeChild(this.element);
        this.element.removeEventListener(`click`, removeErrorMessageHandler);
      };

      this.element.addEventListener(`click`, removeErrorMessageHandler);
    }
  }

  const convertArtistAnswers = (answers) => {
    const screenAnswers = {};
    answers.forEach((item, i) => {
      screenAnswers[`artist-${i}`] = {
        song: {
          name: item.title,
          image: item.image.url
        },
        correct: item.isCorrect
      };
    });
    return screenAnswers;
  };

  const convertGenreAnswers = (answers, genre) => {
    const screenAnswers = {};
    answers.forEach((item, i) => {
      screenAnswers[`answer-${i}`] = {
        song: {
          src: item.src
        },
        correct: item.genre === genre
      };
    });
    return screenAnswers;
  };

  var adaptServerData = (data) => {
    for (const question of data) {
      question.title = question.question;
      if (question.type === `artist`) {
        question.answers = convertArtistAnswers(question.answers);
      } else if (question.type === `genre`) {
        question.answers = convertGenreAnswers(question.answers, question.genre);
      }
    }
    return data;
  };

  // const URL = `https://es.dump.academy/guess-melody`;
  const URL = `https://htmlacademy-react-2.appspot.com/guess-melody/questions`;

  const APP_ID = 33883388;
  const Statuses = {
    SUCCESS: 200,
    MULTIPLE_CHOICES: 300
  };

  const checkStatus = (response) => {
    if (response.status >= Statuses.SUCCESS && response.status < Statuses.MULTIPLE_CHOICES) {
      return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
  };

  const toJSON = (res) => res.json();

  class Loader {

    static loadData() {
      return fetch(`${URL}/questions`)
        .then(checkStatus)
        .then(toJSON)
        .then(adaptServerData);
    }

    static loadResults() {
      return fetch(`${URL}/stats/${APP_ID}`)
        .then(checkStatus)
        .then(toJSON);
    }

    static saveResults(data) {
      const requestSettings = {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': `application/json`
        },
        method: `POST`
      };
      return fetch(`${URL}/stats/${APP_ID}`, requestSettings)
        .then(checkStatus);
    }
  }

  class Router {

    static start() {
      Router.showWelcome();
      Loader.loadData().
        then((data) => Router.startGame(data)).
        catch(Router.showError);
    }

    static showWelcome() {
      const welcomeScreen = new WelcomeScreen();
      showScreen(welcomeScreen.element);
      return welcomeScreen;
    }

    static showGame() {
      const screen = new GameScreen(new GameModel());
      showScreen(screen.element);
    }

    static showResult(result) {
      result.replayButtonClickHandler = () => {
        this.showGame();
      };
      if (result.result.lives > 0 && result.result.time < Time.MAX) {
        Loader.loadResults().
            then((data) => {
              showScreen(result.element);
              result.showStats(data);
            }).
            then(() => Loader.saveResults(result.result)).
            catch(Router.showError);
      } else {
        showScreen(result.element);
      }
    }

    static showError(error) {
      const errorView = new ErrorView(error);
      errorView.showModal();
    }

    static startGame(data) {
      data.forEach((el) => initialState.questions.push(el));
      Router.showWelcome().screen.play();
    }
  }

  Router.start();

}());
