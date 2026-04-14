import usersStore from '../store/users-store'
import { RenderTable } from '../presentation/render-table/render-table'
import { RenderButtons } from '../presentation/render-buttons/render-buttons'
import { RenderAddButton } from '../presentation/render-add-button/render-add-button'
import { RenderModal } from '../presentation/render-modal/render.modal'
import { saveUser } from '../use-cases/save-user'

/**
 * @param {HTMLDivElement} element
 */

export const UsersApp = async(element) => {

    element.innerHTML = 'Loading...'
    await usersStore.loadNextPage()
    element.innerHTML =""

    RenderTable(element);
    RenderButtons(element);
    RenderAddButton(element);
    RenderModal(element, async(userlike) => {
        const user = await saveUser(userlike);
        usersStore.onUserChanged(user);
        RenderTable();
    });
}