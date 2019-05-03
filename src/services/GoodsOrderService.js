import request from '../util/request';

export function addNewGoodsOrder(order) {
    order = JSON.stringify(order);
    let url = '/api/goods/order/add';
    let option = {
        method: 'post',
        body: order,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function getOrderById(orderId) {
    let url = '/api/goods/order/one?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function getOrderListByUser(orderQO) {
    let url = '/api/goods/order/user/list?orderStatus=' + orderQO.tabKey + '&page=' + orderQO.page + '&pageSize=' + orderQO.pageSize;
    let option = {
        method: 'get',
    };
    return request(url, option);
}

export function cancelGoodsOrderById(orderId) {
    let url = '/api/goods/order/user/cancel?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function getOrderListByManager(orderQO) {
    orderQO = JSON.stringify(orderQO);
    let url = '/api/goods/order/manager/list';
    let option = {
        method: 'post',
        body: orderQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function getAliPayUrl(orderId) {
    let url = '/api/goods/order/pay/url?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function checkTradeStatus(orderId) {
    let url = '/api/goods/order/pay/check?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function confirmReceipt(orderId) {
    let url = '/api/goods/order/user/received?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}
