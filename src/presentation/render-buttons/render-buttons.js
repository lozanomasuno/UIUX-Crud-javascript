import userStore from '../../store/users-store.js';
import { RenderTable } from '../render-table/render-table.js';
import './render-buttons.css';


/**
 * 
 * @param {HTMLDivElement} element
 */

export const RenderButtons = (element) => {
   
   const nextButton = document.createElement('button');
   nextButton.textContent = 'Next >'; 

   const prevButton = document.createElement('button');
   prevButton.textContent = '< Prev';

   const currentPageLabel = document.createElement('span')
   currentPageLabel.id = 'current-page';
   currentPageLabel.textContent = userStore.getCurrentPage();

   element.append(prevButton, currentPageLabel, nextButton);


   nextButton.addEventListener('click', async() => {
      await userStore.loadNextPage();
      currentPageLabel.textContent = userStore.getCurrentPage();
      RenderTable(element); 
   });

   prevButton.addEventListener('click', async() => {
      await userStore.loadPreviousPage();
      currentPageLabel.innerText = userStore.getCurrentPage();
      RenderTable(element); 
   });   

}
