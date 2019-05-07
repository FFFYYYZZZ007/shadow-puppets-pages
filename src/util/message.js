import { message } from 'antd';

export function showMessage(result) {
    if (result.success === true) {
        message.success(result.msg, 1);
    } else {
        message.error(result.msg, 1);
    }
}

