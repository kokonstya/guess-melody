import AbstractView from './abstract-view';
import string from '../data/string-data';

export default class ErrorView extends AbstractView {
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
