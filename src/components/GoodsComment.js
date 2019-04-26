import React from 'react';
import {
    Comment, Tooltip, Avatar, Spin, Divider,
} from 'antd';
import moment from 'moment';
import { getCommentList } from '@/services/CommentService';

class GoodsComment extends React.Component {
    state = {
        likes: 0,
        action: null,
        commentList: [],
        loading: true,
        commentQO: {
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
    };

    componentDidMount() {
        this.reloadCommentList();

    }

    reloadCommentList() {
        let commentQO = {
            pageNum: this.state.commentQO.pageNum,
            pageSize: this.state.commentQO.pageSize,
            goodsId: this.props.goodsId,
        };
        getCommentList(commentQO).then((result) => {
            console.log(result);
            this.setState({
                loading: false,
                commentList: result.data.list,
                total: result.data.total,
            });
        });
    }

    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    {this.state.commentList.map(comment => {
                        return (
                            <div key={'comment_' + comment.id}
                            >
                                <Comment
                                    author={comment.userName}
                                    avatar={(
                                        <Avatar style={{
                                            color: '#f56a00',
                                            backgroundColor: '#fde3cf',
                                        }}>{comment.userName}</Avatar>

                                    )}
                                    content={(
                                        <p>{comment.content}</p>
                                    )}
                                    datetime={(
                                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:SS')}>
                                            <span>{moment(comment.dateCreate, 'YYYY-MM-DD HH:mm:SS').fromNow()}</span>
                                        </Tooltip>
                                    )}
                                />
                                <Divider/>
                            </div>
                        );
                    })}
                </Spin>
            </div>
        );
    }
}

export default GoodsComment;
