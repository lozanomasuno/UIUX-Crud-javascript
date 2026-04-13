import './style.css'

import {UsersApp} from './use-cases/users-app'

document.querySelector('#app').innerHTML = `
  <div>
    <h1> This is a JS C R U D </h1>
    <div class="card">
    </div>
  </div>
`
const element = document.querySelector('.card')
UsersApp(element);