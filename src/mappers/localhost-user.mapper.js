import  {User} from '../models/user';

/**
 * @param {Like<User>} localhostUser
 * @returns {User}
 */

export const localHostToUserModel  = (localhostUser) =>{
    const {
        avatar,
        balance,
        first_name,
        gender,
        id,
        isActive,
        last_Name 
    } = localhostUser

    return new User(
        {
            avatar,
            balance,
            firstName: first_name,
            gender,
            id,
            isActive,
            lastName: last_Name 
        }
    )
}