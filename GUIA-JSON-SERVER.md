# CRUD con JSON Server

Una guía breve, clara y práctica para entender cómo se carga la información en este proyecto y cómo conectar la tabla con `json-server` sin perderte en el proceso.

---

## Panorama general

Este proyecto usa una arquitectura sencilla por capas:

1. `server/db.json` guarda los datos simulados.
2. `json-server` expone esos datos como una API REST local.
3. `load-users-by-page.js` consume la API con `fetch`.
4. `localhost-user.mapper.js` transforma la respuesta del backend al formato que usa la interfaz.
5. `users-store.js` mantiene el estado actual en memoria.
6. `users-app.js` coordina la carga inicial.
7. `render-table.js` toma los usuarios del store y los dibuja en la tabla.

En otras palabras:

```text
server/db.json
   -> json-server
   -> fetch(.../users?_page=1)
   -> mapper
   -> store
   -> renderizado en tabla
```

---

## Estructura importante del proyecto

```text
server/
  db.json

src/
  main.js
  models/user.js
  mappers/localhost-user.mapper.js
  store/users-store.js
  use-cases/load-users-by-page.js
  use-cases/users-app.js
  presentation/render-table/render-table.js
  presentation/render-table/render-table.css
```

---

## Paso 1. Definir la fuente de datos

El archivo `server/db.json` actúa como una base de datos falsa.

Ejemplo de registro:

```json
{
  "id": 1,
  "isActive": false,
  "balance": 1397.32,
  "avatar": "http://placehold.it/32x32",
  "first_name": "Ryan",
  "last_name": "Kent",
  "gender": "male"
}
```

Puntos clave:

- La colección principal se llama `users`.
- Los nombres de las propiedades vienen en `snake_case` para nombre y apellido.
- La UI necesita convertir esos campos a un formato más cómodo para el frontend.

---

## Paso 2. Levantar la API con JSON Server

En tu `package.json` ya existe este script:

```json
"canela": "json-server server/db.json --port 3001 --watch"
```

Para ejecutar el servidor local:

```bash
npm run canela
```

Eso levanta una API en:

```text
http://localhost:3001
```

Y la ruta de usuarios queda así:

```text
http://localhost:3001/users
```

Si quieres probar paginación:

```text
http://localhost:3001/users?_page=1
```

Nota importante:

Las versiones recientes de `json-server` pueden responder con una estructura como esta cuando usas paginación:

```json
{
  "first": 1,
  "prev": null,
  "next": 2,
  "last": 6,
  "pages": 6,
  "items": 60,
  "data": [
    { "id": 1, "first_name": "Ryan" }
  ]
}
```

Por eso en el proyecto no conviene asumir siempre que la respuesta sea un arreglo plano.

---

## Paso 3. Arrancar la aplicación frontend

Para correr la app con Vite:

```bash
npm install
npm run dev
```

Normalmente tendrás dos procesos al mismo tiempo:

1. `npm run canela`
2. `npm run dev`

Uno sirve los datos y el otro sirve la interfaz.

---

## Paso 4. Punto de entrada de la app

El archivo `src/main.js` inicia la aplicación:

```js
import './style.css'
import { UsersApp } from './use-cases/users-app'

const element = document.querySelector('.card')
UsersApp(element)
```

Responsabilidad de esta etapa:

- Crear el contenedor visual.
- Llamar a `UsersApp`.
- Delegar toda la lógica de carga inicial.

---

## Paso 5. Cargar la primera página de usuarios

El archivo `src/use-cases/users-app.js` coordina el flujo inicial:

```js
element.innerHTML = 'Loading...'
await usersStore.loadNextPage()
element.innerHTML = ''

RenderTable(element)
```

¿Qué hace?

1. Muestra un estado de carga.
2. Pide al store la siguiente página.
3. Limpia el contenedor.
4. Renderiza la tabla con los datos ya cargados.

---

## Paso 6. Consumir la API con fetch

La carga real ocurre en `src/use-cases/load-users-by-page.js`.

Lógica principal:

```js
const baseUrl = (import.meta.env.VITE_BASE_URL || 'http://localhost:3001').replace(/\/$/, '')
const url = `${baseUrl}/users?_page=${page}`
const response = await fetch(url)
```

### Qué está pasando aquí

- Se usa `VITE_BASE_URL` si existe.
- Si no existe, se usa `http://localhost:3001`.
- Se consulta `/users?_page=1`, `/users?_page=2`, etc.

Luego se valida la respuesta:

```js
if (!response.ok) {
  throw new Error(`Failed to load users: ${response.status} ${response.statusText}`)
}
```

Y también se revisa que la respuesta sea JSON:

```js
const contentType = response.headers.get('content-type') || ''
if (!contentType.includes('application/json')) {
  const rawResponse = await response.text()
  throw new Error(`Expected JSON from ${url}, received: ${rawResponse.slice(0, 60)}`)
}
```

Eso evita errores difíciles de depurar cuando la URL responde HTML, texto o una página de error.

---

## Paso 7. Adaptar la respuesta paginada de JSON Server

Después del `response.json()`, el proyecto maneja ambos formatos posibles:

```js
const data = await response.json()
const list = Array.isArray(data) ? data : (data.data ?? [])
```

Esto resuelve dos escenarios:

- Si la API responde `[{...}, {...}]`, usa ese arreglo directo.
- Si responde `{ data: [{...}] }`, extrae `data.data`.

Este detalle es importante porque evita el error:

```text
TypeError: data.map is not a function
```

---

## Paso 8. Convertir los datos del backend al modelo del frontend

El backend devuelve:

- `first_name`
- `last_name`

Pero la interfaz usa:

- `firstName`
- `lastName`

Por eso existe `src/mappers/localhost-user.mapper.js`.

Ejemplo conceptual:

```js
return new User({
  id,
  isActive,
  balance,
  avatar,
  gender,
  firstName: first_name,
  lastName: last_name,
})
```

### Por qué esto importa

Si no haces esta transformación, la tabla termina intentando leer propiedades que no existen y aparecen valores `undefined`.

---

## Paso 9. Guardar los usuarios en el store

El archivo `src/store/users-store.js` mantiene el estado de la página actual.

Conceptualmente guarda:

```js
const state = {
  currentPage: 0,
  users: []
}
```

Cuando se llama `loadNextPage()`:

1. Pide usuarios a `loadUsersByPage(state.currentPage + 1)`.
2. Si no llegan usuarios, no avanza la página.
3. Incrementa `currentPage`.
4. Guarda los usuarios en `state.users`.

Ventaja de este enfoque:

- La vista no conoce el `fetch` directo.
- La capa visual solo le pide datos al store.
- La lógica queda separada del render.

---

## Paso 10. Renderizar la tabla

El archivo `src/presentation/render-table/render-table.js` toma los usuarios desde el store:

```js
const users = usersStore.getUsers()
```

Luego crea filas dinámicamente:

```js
users.forEach(user => {
  TableHTML += `
    <tr>
      <td>${user.id}</td>
      <td>${user.balance}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.isActive}</td>
    </tr>
  `
})
```

Aquí ya no se usan los nombres originales del backend. La tabla trabaja únicamente con el modelo transformado.

---

## Flujo completo paso a paso

### Flujo técnico

1. Ejecutas `npm run canela`.
2. `json-server` expone `server/db.json` como API REST.
3. Ejecutas `npm run dev`.
4. Vite carga `src/main.js`.
5. `main.js` llama a `UsersApp(element)`.
6. `UsersApp` invoca `usersStore.loadNextPage()`.
7. El store llama a `loadUsersByPage(1)`.
8. `loadUsersByPage` hace `fetch` a `http://localhost:3001/users?_page=1`.
9. La respuesta JSON se valida.
10. Se extrae el arreglo real de usuarios.
11. Cada usuario pasa por `localHostToUserModel`.
12. El resultado se guarda en el estado interno del store.
13. `RenderTable` toma los usuarios del store.
14. La tabla se dibuja en pantalla.

---

## Problemas comunes y cómo evitarlos

### 1. `does not provide an export named 'default'`

Causa:

- Importar como `default` algo que fue exportado como nombrado.

Solución:

```js
import { localHostToUserModel } from '../mappers/localhost-user.mapper'
```

---

### 2. `data.map is not a function`

Causa:

- `json-server` respondió un objeto con `data`, no un arreglo directo.

Solución:

```js
const list = Array.isArray(data) ? data : (data.data ?? [])
```

---

### 3. `usersStore is not defined`

Causa:

- El módulo de render intentó usar `usersStore` sin importarlo.

Solución:

```js
import usersStore from '../../store/users-store'
```

---

### 4. Nombres `undefined` en la tabla

Causa:

- El backend usa `first_name` y `last_name`, pero la vista esperaba `firstName` y `lastName`.

Solución:

- Corregir el mapper.
- Unificar el modelo `User` con nombres consistentes.

---

## Recomendaciones para seguir creciendo esta funcionalidad

### Siguiente mejora natural

1. Agregar botones para paginación.
2. Implementar `loadPreviousPage()`.
3. Agregar recarga automática tras crear o eliminar un usuario.
4. Separar las acciones `Edit` y `Delete` con listeners reales.
5. Formatear `balance` como moneda.
6. Mostrar el estado `isActive` como etiqueta visual en lugar de `true` o `false`.

---

## Comandos útiles

```bash
npm install
npm run canela
npm run dev
npm run build
```

---

## Resumen ejecutivo

Si quieres que esta funcionalidad funcione correctamente con `json-server`, recuerda estas cuatro reglas:

1. El servidor local debe estar corriendo en el puerto correcto.
2. La respuesta paginada puede venir dentro de `data`.
3. El mapper debe traducir `snake_case` a `camelCase`.
4. La vista debe renderizar únicamente el modelo transformado, no la respuesta cruda del backend.

Con eso, la tabla deja de depender de supuestos frágiles y el flujo completo se vuelve mucho más estable.
