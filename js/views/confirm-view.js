import AbstractView from './abstract-view';
import string from '../data/string-data';

export default class ConfirmView extends AbstractView {
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
