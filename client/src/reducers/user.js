export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const initialStore = {
    loggedIn: false
};

export default function (store = initialStore, action) {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return {
                ...store,
                loggedIn: true
            };
        case LOGOUT_SUCCESS:
            return {
                ...store,
                loggedIn: false
            };
        default:
            return store
    }
}
