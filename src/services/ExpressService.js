import request from '../util/request';

export function getList(expressDeliveryQO) {
    expressDeliveryQO = JSON.stringify(expressDeliveryQO);
    let url = '/api/delivery/manager/list';
    let option = {
        method: 'post',
        body: expressDeliveryQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function getOne(orderId) {
    let url = '/api/delivery/manager/one?orderId='+orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function codeGenerate(expressCarrier) {
    let url = '/api/delivery/manager/codeGenerate?expressCarrier='+expressCarrier;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function ship(shipQO) {
    shipQO = JSON.stringify(shipQO);
    let url = '/api/delivery/manager/ship';
    let option = {
        method: 'post',
        body: shipQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function changeExpressDeliveryStatus(orderId, deliveryStatus) {
    let url = '/api/delivery/manager/status/update?orderId=' + orderId + '&deliveryStatus=' + deliveryStatus;
    let option = {
        method: 'post',
    };
    return request(url, option);
}
