import './render-table.css';
import usersStore from '../../store/users-store';
let table;


const createTable = () => { 
    const table = document.createElement('table');
    const tableHeaders = document.createElement('thead');
    const tbody = document.createElement('tbody');

    tableHeaders.innerHTML = `
        <tr>
            <th>"id"</th>
            <th>Balance</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Active</th>
        </tr>
    `;

    const tableBody = document.createElement('tbody');
    table.append(tableHeaders, tableBody);

    return table;    
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

    //TODO: Listeners a las tablas|
  }

  let TableHTML = ""
  users.forEach( user => {
    TableHTML += `
        <tr>
            <td>${user.id}</td>
            <td>${user.balance}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>  
            <td>${user.isActive}</td> 
            <td>
               <a href="#" data-id="${user.id}" class="edit">Edit</a>
               |
               <a href="#" data-id="${user.id}" class="delete">Delete</a>
            </td>
        <tr>   
        `     
  })

  table.querySelector('tbody').innerHTML = TableHTML;

}