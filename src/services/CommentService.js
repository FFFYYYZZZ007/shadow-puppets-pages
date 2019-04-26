import request from '../util/request';

export function getCommentList(commentQO) {
    commentQO = JSON.stringify(commentQO);
    let url = '/api/comment/list';
    let option = {
        method: 'post',
        body: commentQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option)
}

export function addComment(GoodsCommentPO) {
    GoodsCommentPO = JSON.stringify(GoodsCommentPO);
    let url = '/api/comment/add';
    let option = {
        method: 'post',
        body: GoodsCommentPO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option)
}
