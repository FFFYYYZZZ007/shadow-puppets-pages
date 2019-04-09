import request from '../util/request';

export function getShoppingCartList() {
    let url = 'api/cart/list';
    let option = {
      method: 'get'
    };
  return request(url, option);
};

export function addShoppingCart(shoppingCart) {
  shoppingCart = JSON.stringify(shoppingCart);
  let url = 'api/cart/add';
  let option = {
    method: 'post',
    body: shoppingCart,
    headers: { 'Content-type': 'application/json; charset=utf-8' },
  };
  return request(url, option);
};

export function deleteShoppingCartList(shoppingCartIdList) {
  let url = 'api/cart/list';
  let option = {
    method: 'post',
    body: shoppingCartIdList,
    headers: { 'Content-type': 'application/json; charset=utf-8' },
  };
  return request(url, option);
}
