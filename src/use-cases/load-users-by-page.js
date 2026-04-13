import {User} from '../models/user';
import { localHostToUserModel } from '../mappers/localhost-user.mapper';

/**
 * 
 * @param {Number} page 
 * @returns { Promise<User[]> }
 */
export const loadUsersByPage = async(page = 1) => {
    const baseUrl = (import.meta.env.VITE_BASE_URL || 'http://localhost:3001').replace(/\/$/, '')
    const url = `${baseUrl}/users?_page=${page}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to load users: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
        const rawResponse = await response.text()
        throw new Error(`Expected JSON from ${url}, received: ${rawResponse.slice(0, 60)}`)
    }

    const data = await response.json()
    const list = Array.isArray(data) ? data : (data.data ?? [])

    const users  = list.map( userLike => localHostToUserModel(userLike))

    return users;
}
