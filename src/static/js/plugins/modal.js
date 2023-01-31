let modalOpened, modalRemove = false;
const modalCloseButtons = document.querySelectorAll('.js-modal-close');
const modalOpenButtons = document.querySelectorAll('.js-modal-open');
modalCloseButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
        modalClose();
        e.preventDefault();
    });
});
modalOpenButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
        modalOpen(button.getAttribute('href'));
        e.preventDefault();
    });
});
window.modalOpen = function(id) {
    if(modalOpened) { modalClose(); }
    modalOpened = document.querySelector(id);
    modalOpened.classList.remove('hidden');
}
window.modalClose = function(id) {
    if(modalOpened) {
        modalOpened.classList.add('hidden');
        if(modalRemove) {
            modalOpened.remove();
            modalRemove = false;
        }
        modalOpened = undefined;
    } else {
        const modal = document.querySelector(id);
        modal.classList.add('hidden');
    }
}
window.modalCreate = function(id, size, title, content) {
    const html = `
        <div class="modal" id="${id}">
          <div class="modal__overlay" onclick="modalClose()"></div>
          <div class="modal__inner modal__inner--${size}">
            <button class="modal__close" type="button" onclick="modalClose()" aria-label="Закрыть модальное окно"></button>
            <div class="modal__head">${title}</div>
            <div class="modal__body">${content}</div>
          </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    modalOpened = document.querySelector('#' + id);
    modalRemove = true;
}