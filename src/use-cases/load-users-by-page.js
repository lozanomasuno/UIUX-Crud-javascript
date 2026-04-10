/**
 * 
 * @param {Number} page 
 * @returns 
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
    
    console.log(data)

    return Array.isArray(data) ? data : data.data
}
