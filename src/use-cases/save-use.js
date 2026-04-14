import { User } from '../models/User';
import { userModelToLocalhost } from '../mappers/user-to-localhost.mapper.js';

/**
 * 
 * @param {Like<User>} userLike
 */

export const saveUser = async(userLike) =>{

    const user = new User(userLike);

    if (!user.name || !user.email) 
        throw 'First & Last name are required';

    const userToSave = userModelToLocalhost(user);

    if(user.id){
        throw new Error('User already exists');
    } 

    const updateUser = await createUser(userToSave);

    return updateUser


}


/**
 * @param {like<User>} user
 * 
 */

const createUser = async(user) => {
    
    const url =  `${import.meta.env.VITE_BASE_URL}/users`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {      
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });    


    const newUser = await res.json();
    console.log(newUser);

    return newUser;
}