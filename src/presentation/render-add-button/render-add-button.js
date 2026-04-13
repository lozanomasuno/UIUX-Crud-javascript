import './render-add-button.css'
/**
 * 
 * @param {HTMLDivElement} element 
 * @param {()=> void)} callback
 */
export const renderAddButton = (element, callback) => {

    const fabButton = document.createElement('button');

    fabButton.textContent = '+';
    fabButton.classList.add('fab-button');


    element.appendChild(fabButton);

    fabButton.addEventListener('click', () => {
       throw new Error('no implementado');
    })
}