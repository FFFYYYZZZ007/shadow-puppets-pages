import request from '../util/request';

export function getList(goodsListQO) {
    goodsListQO = JSON.stringify(goodsListQO);
    let url = '/api/goods/list';
    let option = {
        method: 'post',
        body: goodsListQO,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, option)
}

export function getManagerList(goodsListQO) {
    goodsListQO = JSON.stringify(goodsListQO);
    let url = '/api/goods/manager/list';
    let option = {
        method: 'post',
        body: goodsListQO,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, option)
}

export function getDetails(id) {
    let url = '/api/goods/one?goodsId=' + id;
    let option = {
        method: 'get'
    };
    return request(url, option)
}

export function addGoods(goodsBO) {
    goodsBO = JSON.stringify(goodsBO);
    let url = '/api/goods/manager/add';
    let option = {
        method: 'post',
        body: goodsBO,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, option)
}

export function removeGoods(goodsId) {
    let url = '/api/goods/manager/remove?goodsId=' + goodsId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function updateGoods(goodsBO) {
    goodsBO = JSON.stringify(goodsBO);
    let url = '/api/goods/manager/update';
    let option = {
        method: 'post',
        body: goodsBO,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, option)
}

export function categoryStatisticsInfo() {
    let url = '/api/goods/manager/category/statistics';
    let option = {
        method: 'post',
    };
    return request(url, option)
}

export function getCategory() {
    let url = '/api/category/list';
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function addCategory(category) {
    category = JSON.stringify(category);
    let url = '/api/category/add';
    let option = {
        method: 'post',
        body: category,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, option);
}


export function updateCategory(category) {
    category = JSON.stringify(category);
    let url = '/api/category/update';
    let option = {
        method: 'post',
        body: category,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, option);
}

export function removeCategory(categoryId) {
    let url = '/api/category/remove?id=' + categoryId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function removeGoodsImage(goodsId, imageUrl) {
    let url = '/api/goods/manager/image/remove?goodsId=' + goodsId + '&imageUrl=' + imageUrl;
    let option = {
        method: 'post',
    };
    return request(url, option);
}