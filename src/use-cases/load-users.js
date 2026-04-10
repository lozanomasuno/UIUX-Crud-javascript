export const loadUsers = (page = 1) => {
    const url   = `https://reqres.in/api/users?page=${page}`
    return fetch(url)
        .then(response => response.json())
        .then(data => data.data)
}
