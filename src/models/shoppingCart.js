import {getShoppingCartList} from '../services/ShoppingCartService';

export default {
  namespace: 'shoppingCart',
  state: {
    shoppingCartList: [],
  },
  effects: {
    * getShoppingCartList(_, sagaEffects) {
      const {call, put} = sagaEffects;
      // call 请求服务端数据, 通过 request
      const result = yield call(getShoppingCartList, _);
      // 调用 reducers 中的方法
      yield put({type: 'changeShoppingCartList', payload: result.data});
    }
},
  reducers: {
    changeShoppingCartList(state, {payload: shoppingCartList}) {
      return {
        ...state, shoppingCartList
      };
    }
  },
};
