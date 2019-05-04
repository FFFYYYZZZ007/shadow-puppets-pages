import request from '../util/request';

export function getCommentList(commentQO) {
    commentQO = JSON.stringify(commentQO);
    let url = '/api/course/comment/list';
    let option = {
        method: 'post',
        body: commentQO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option)
}

export function addComment(courseCommentPO) {
    courseCommentPO = JSON.stringify(courseCommentPO);
    let url = '/api/course/comment/add';
    let option = {
        method: 'post',
        body: courseCommentPO,
        headers: { 'Content-type': 'application/json; charset=utf-8' },
    };
    return request(url, option)
}
