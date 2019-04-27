import request from '../util/request';

export function getShoppingCartList() {
    let url = 'api/cart/list';
    let option = {
        method: 'get',
    };
    return request(url, option);
}

export function addShoppingCart(shoppingCart) {
    shoppingCart = JSON.stringify(shoppingCart);
    let url = 'api/cart/add';
    let option = {
        method: 'post',
        body: shoppingCart,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function deleteOneShoppingCart(id) {
    let url = 'api/cart/delete/one?shoppingCartId=' + id;
    let option = {
        method: 'post',
    };
    return request(url, option);
}


export function deleteAllShoppingCart() {
    let url = 'api/cart/delete/all';
    let option = {
        method: 'post',
    };
    return request(url, option);
}
