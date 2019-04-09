import { getDetails } from '../services/GoodsService';
export default {
    namespace: 'goodsDetails',
    state: {
        goodsDetails: '',
    },
    effects: {
        *getGoodsDetails(param, sagaEffects) {
            const { call, put } = sagaEffects;
            // call 请求服务端数据, 通过 request
            const result = yield call(getDetails, param.payload);
            // 调用 reducers 中的方法
            console.log(result)
            yield put({ type: 'queryGoodsDetails', payload: result.data });
        }
    },
    reducers: {
        queryGoodsDetails(state, { payload: goodsDetails }) {
            console.log(goodsDetails)
            return {
                ...state, goodsDetails
            };
        }
    },
};