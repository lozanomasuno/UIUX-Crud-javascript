import { User } from '../models/user';

/**
 * @param {User} userModel
 * 
 */
export const userModelToLocalhost = (user) => {
    const {
        avatar,
        balance,
        firstName,
        id,
        isActive,
        lastName,
        phone,
        username,   
    } = user;

    return {
        avatar,
        balance,
        first_name: firstName,
        id,
        isActive,
        last_name: lastName,
        phone,
        username,  
    }
}