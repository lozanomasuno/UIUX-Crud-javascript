import { showModal } from '../render-modal/render.modal.js';
import './render-add-button.css'

/**
 * 
 * @param {HTMLDivElement} element 
 * @param {()=> void} callback
 */
export const RenderAddButton = (element, callback) => {

    const fabButton = document.createElement('button');

    fabButton.textContent = '+';
    fabButton.classList.add('fab-button');


    element.appendChild(fabButton);

    fabButton.addEventListener('click', () => {
       showModal();
    })
}