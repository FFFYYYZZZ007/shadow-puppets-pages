import request from '../util/request';

export function getCourseList(courseQO) {
    courseQO = JSON.stringify(courseQO);
    let url = '/api/course/list';
    let option = {
        method: 'POST',
        body: courseQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function getRecommendCourseList() {
    let url = '/api/course/recommend';
    let option = {
        method: 'GET',
    };
    return request(url, option);
}

export function getCourseVO(id) {
    let url = '/api/course/detail?id=' + id;
    let option = {
        method: 'GET',
    };
    return request(url, option);
}

export function getCourseManagerList(courseQO) {
    courseQO = JSON.stringify(courseQO);
    let url = '/api/course/manager/list';
    let option = {
        method: 'POST',
        body: courseQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}


export function updateCourse(courseBO) {
    courseBO = JSON.stringify(courseBO);
    let url = '/api/course/manager/update';
    let option = {
        method: 'POST',
        body: courseBO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function addCourse(courseBO) {
    courseBO = JSON.stringify(courseBO);
    let url = '/api/course/manager/add';
    let option = {
        method: 'POST',
        body: courseBO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}


export function deleteCourse(id) {
    let url = '/api/course/manager/delete?id=' + id;
    let option = {
        method: 'POST',
    };
    return request(url, option);
}

export function createNewCourseOrder(courseOrder) {
    courseOrder = JSON.stringify(courseOrder);
    let url = '/api/course/order/add';
    let option = {
        method: 'POST',
        body: courseOrder,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function getOrderInfo(id) {
    let url = '/api/course/order/info?orderId=' + id;
    let option = {
        method: 'POST',
    };
    return request(url, option);
}
export function getPayUrl(id) {
    let url = '/api/course/order/payUrl?orderId=' + id;
    let option = {
        method: 'POST',
    };
    return request(url, option);
}


export function checkTradeStatus(orderId) {
    let url = '/api/course/order/pay/check?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function confirmStudy(orderId) {
    let url = '/api/course/order/confirm?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}

export function closeOrder(id) {
    let url = '/api/course/order/close?orderId=' + id;
    let option = {
        method: 'POST',
    };
    return request(url, option);
}

export function getUserCourseOrderList(courseOrderQO) {
    courseOrderQO = JSON.stringify(courseOrderQO);
    let url = '/api/course/order/user/list';
    let option = {
        method: 'POST',
        body: courseOrderQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}

export function getCourseOrderList(courseOrderQO) {
    courseOrderQO = JSON.stringify(courseOrderQO);
    let url = '/api/course/order/list';
    let option = {
        method: 'POST',
        body: courseOrderQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option);
}


export function endCourse(orderId) {
    let url = '/api/course/manager/order/endCourse?orderId=' + orderId;
    let option = {
        method: 'post',
    };
    return request(url, option);
}


