import request from '../util/request';

export function getMessage() {
    let url = 'api/user/get';
    let options = {
        method: 'get'
    };
    return request(url, options);
}

export function register(user) {
    let code = user.code;
    user = JSON.stringify(user);
    let url = 'api/user/register?code=' + code;
    let options = {
        method: 'post',
        body: user,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    }
    return request(url, options);
}

export function login(user) {
    console.log(localStorage.getItem("token"));
    user = JSON.stringify(user);
    let url = 'api/user/login';
    let options = {
        method: 'post',
        body: user,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, options);
}

export function sendVerificationCode(tel) {
    let url = '/api/user/code?tel=' + tel;
    let options = {
        method: 'get',
    }
    return request(url, options);
}

export function getUserManagerList(userListQO) {
    let url = '/api/user/manager/list'
    userListQO = JSON.stringify(userListQO);
    let options = {
        method: 'post',
        body: userListQO,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, options);
}

export function updateUser(user) {
    let url = '/api/user/update'
    user = JSON.stringify(user);
    let options = {
        method: 'post',
        body: user,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
    };
    return request(url, options);
}

export function deleteUser(id){
    let url = '/api/user/manager/remove?userId='+id;
    let options = {
        method: 'post'
    };
    return request(url, options);
}

