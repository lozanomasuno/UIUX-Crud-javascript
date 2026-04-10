const state = {
    currentPage: 0,
    users : []
}

const loadNextPage = async() => {   
    throw new Error('Not implemented yet')
}

 const loadPreviousPage = async() => {
    throw new Error('Not implemented yet')
}
//TODO: implementar
const onUserChanged = (user) => {
    throw new Error('Not implemented yet')
}

const reloadPage = async() => {
    throw new Error('Not implemented yet')
}



export default{
    loadNextPage,
    loadPreviousPage,
    onUserChanged,
    reloadPage,

    getUser: () => [...state.users],
    getCurrentPage: () => state.currentPage
}