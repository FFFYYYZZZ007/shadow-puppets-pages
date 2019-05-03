import request from '../util/request';

export function userDateAnalysis() {
    let url = '/api/analysis/user';
    let option = {
        method: 'get',
    };
    return request(url, option);
}


export function orderDateAnalysis() {
    let url = '/api/analysis/order';
    let option = {
        method: 'get',
    };
    return request(url, option);
}

export function priceDateAnalysis() {
    let url = '/api/analysis/price';
    let option = {
        method: 'get',
    };
    return request(url, option);
}

export function goodsGroupByCategory() {
    let url = '/api/analysis/goods/category';
    let option = {
        method: 'get',
    };
    return request(url, option);
}
