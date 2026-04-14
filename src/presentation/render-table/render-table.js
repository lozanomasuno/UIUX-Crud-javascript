import './render-table.css';
import usersStore from '../../store/users-store';
import { showModal } from '../render-modal/render.modal'
import { deleteUserById } from '../../use-cases/delete-user-by-id';

let table;


const createTable = () => { 
    const table = document.createElement('table');
    const tableHeaders = document.createElement('thead');

    tableHeaders.innerHTML = `
        <tr>
            <th>Id</th>
            <th>Balance</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;

    const tableBody = document.createElement('tbody');
    table.append(tableHeaders, tableBody);

    return table;    
}

/**
 * @param {MouseEvent} event
 */
const tableSelectedListener = (event) => {
    const element = event.target.closest('.select-user');
    
    if (!element) return;

    const id = element.getAttribute('data-id')

    showModal(id);
}

/**
 * @param {MouseEvent} event
 */
const tableDeleteListener = async (event) => {
    const element = event.target.closest('.delete-user');
    
    if (!element) return;

    const id = element.getAttribute('data-id')

    try{
        await deleteUserById(id);
        await usersStore.reloadPage();
        document.querySelector('#current-page').textContent = usersStore.getCurrentPage();
        RenderTable();
    } catch(error){
        console.log(error)
        alert('Error deleting user');
    }
    
}

/**
 * 
 * @param {HTMLDivElement} element 
 */
export const RenderTable = (element) => {

  const users = usersStore.getUsers();

  if(!table) {
    table = createTable();
    element.append(table);

    table.addEventListener('click', tableSelectedListener);
    table.addEventListener('click', tableDeleteListener);

  }

  let TableHTML = ""
  users.forEach( user => {
    const statusClass = user.isActive ? 'status-dot--active' : 'status-dot--inactive';
    TableHTML += `
        <tr>
            <td>${user.id}</td>
            <td>${user.balance}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>  
            <td><span class="status-dot ${statusClass}" title="${user.isActive ? 'Active' : 'Inactive'}"></span></td> 
            <td>
               <a href="#" data-id="${user.id}" class="select-user btn-action btn-edit" title="Edit">&#9998;</a>               
               <a href="#" data-id="${user.id}" class="delete-user btn-action btn-delete" title="Delete">&#10005;</a>
            </td>
        <tr>   
        `     
  })

  table.querySelector('tbody').innerHTML = TableHTML;

}