import { getOrderListByUser, getOrderById } from '../services/GoodsOrderService';

export default {
    namespace: 'goodsOrder',
    state: {
        list: [],
        goodsOrder: ''
    },
    effects: {
        *getGoodsOrderList(param, sagaEffects) {
            const { call, put } = sagaEffects;
            const result = yield call(getOrderListByUser, param.payload);
            yield put({ type: 'queryGoodsOrderList', payload: result.data });
        },
        *getOrderById(param, sagaEffects) {
            const { call, put } = sagaEffects;
            const result = yield call(getOrderById, param.payload);
            yield put({ type: 'queryOrderById', payload: result.data });
        },
    },
    reducers: {
        queryGoodsOrderList(state, { payload: list }) {
            return {
                ...state, list
            };
        },
        queryOrderById(state, { payload: goodsOrder }) {
            return {
                ...state, goodsOrder
            };
        }
    },
};
