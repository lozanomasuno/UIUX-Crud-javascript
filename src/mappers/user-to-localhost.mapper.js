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
        Gender,
        id,
        lastName,
        phone,
        username,   
    } = user;

    return {
        avatar,
        balance,
        first_name: firstName,
        Gender,
        id,
        last_name: lastName,
        phone,
        username,  
    }
}