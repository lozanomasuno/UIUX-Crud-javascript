import { loadUsersByPage } from "../use-cases/load-users-by-page";


const state = {
    currentPage: 0,
    users : []
}

export const loadNextPage = async() => {   
   await loadUsersByPage(state.currentPage + 1);
}

export const loadPreviousPage = async() => {
    throw new Error('Not implemented yet')
}

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