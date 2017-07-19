import {createStore, combineReducers} from 'redux';

export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';

export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';

const defaultState = {
    messages: [
        {
            date: new Date('2016-10-10 10:11:55'),
            postedBy: 'Stan',
            content: 'I <3 the new productivity app!'
        }, {
            date: new Date('2017-05-10 10:39:55'),
            postedBy: 'Stan',
            content: 'I hate! the new productivity app!'
        }, {
            date: new Date('2010-10-11 01:11:55'),
            postedBy: 'Stan',
            content: 'Meh!'
        }
    ],
    userStatus: ONLINE
}

const render = () => {
    const {messages, userStatus} = store.getState();
    document
        .getElementById('messages')
        .innerHTML = messages.sort((a, b) => b.date - a.date)
        .map(message => (`
                <div>
                    ${message.postedBy} : ${message.content}
                </div>
            `))
        .join("");

    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
    document.forms.newMessage.newMessage.value = "";
}

const userStatusReducer = (state = defaultState.userStatus, {type, value}) => {
    switch (type) {
        case UPDATE_STATUS:
            return value;
    }

    return state;
}

const messagesReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            const newState = [{ date, postedBy, content: value}, ...state];
            return newState;
    }

    return state;
}

const combineReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messagesReducer
});

const store = createStore(combineReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const statusUpdateAction = (value) => {
    return {type: UPDATE_STATUS, value}
}

const createMessageAction = (content, postedBy) => {
    const date = new Date();
    return {type: CREATE_NEW_MESSAGE, value: content, postedBy, date}
}

document
    .forms
    .selectStatus
    .status
    .addEventListener('change', (e) => {
        store.dispatch(statusUpdateAction(e.target.value));
    });

document
    .forms
    .newMessage
    .addEventListener('submit', (e) => {
        e.preventDefault();
        const value = e.target.newMessage.value;
        const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).userName: "Jimmy";
        store.dispatch(createMessageAction(value, username));
    });

render();

store.subscribe(render);