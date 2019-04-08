import { getMessage } from '../services/UserService';
export default {
    namespace: 'puzzlecards',
    state: {
        data: [],
        counter: 0,
    },
    effects: {
        *queryInitCards(_, sagaEffects) {
            const { call, put } = sagaEffects;
            const endPointURI = '/api/user/get';

            // call 请求服务端数据, 通过 request
            const puzzle = yield call(getMessage, endPointURI);
            // 调用 reducers 中的方法
            yield put({ type: 'addNewCard', payload: puzzle });
        }
    },
    reducers: {
        addNewCard(state, { payload: newCard }) {
            const nextCounter = state.counter + 1;
            const newCardWithId = { ...newCard, id: nextCounter };
            const nextData = state.data.concat(newCardWithId);
            return {
                data: nextData,
                counter: nextCounter,
            };
        }
    },
};