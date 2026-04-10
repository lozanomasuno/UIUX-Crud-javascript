import './style.css'

import {UsersApp} from './use-cases/users-app'

document.querySelector('#app').innerHTML = `
  <div>
    <h1> Hello vite! </h1>
    <div class="card">
    </div>
  </div>
`
const element = document.querySelector('.card')
UsersApp(element);