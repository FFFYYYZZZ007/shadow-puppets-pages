import { getList, getCategory } from '../services/GoodsService';
export default {
    namespace: 'goodsList',
    state: {
        list: [],
        category: []
    },
    effects: {
        *getGoodsList(param, sagaEffects) {
            const { call, put } = sagaEffects;
            const result = yield call(getList, param.payload);
            yield put({ type: 'resetGoodsList', payload: result.data });
        },
        *getCategory(_, sagaEffects) {
            const { call, put } = sagaEffects;
            const result = yield call(getCategory, _);
            yield put({ type: 'resetCategory', payload: result.data });
        }
    },
    reducers: {
        resetGoodsList(state, { payload: list }) {
            return {
                ...state, list
            };
        },
        resetCategory(state, { payload: category }) {
            return {
                ...state, category
            };
        }
    },
};
