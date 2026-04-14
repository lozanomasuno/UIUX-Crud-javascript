import { User } from '../models/user.js';
import { userModelToLocalhost } from '../mappers/user-to-localhost.mapper.js';
import { localHostToUserModel } from '../mappers/localhost-user.mapper.js';

/**
 * 
 * @param {Like<User>} userLike
 */

export const saveUser = async(userLike) =>{

    const user = new User(userLike);

    const firstName = user.firstName?.trim();
    const lastName = user.lastName?.trim();

    if (!firstName || !lastName) {
        throw new Error('First & Last name are required');
    }

    user.firstName = firstName;
    user.lastName = lastName;

    const userToSave = userModelToLocalhost(user);
    let userUpdated;

    if(user.id){
       userUpdated = await updateUser(userToSave);
    } else{
       userUpdated = await createUser(userToSave);
    }   

   return  localHostToUserModel(userUpdated);
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

/**
 * @param {like<User>} user
 * 
 */
const updateUser = async(user) => {
    
    const url =  `${import.meta.env.VITE_BASE_URL}/users/${user.id}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {      
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });    


    const updatedUser = await res.json();
    return updatedUser;
}