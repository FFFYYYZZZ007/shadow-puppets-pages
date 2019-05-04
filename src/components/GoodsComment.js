import React from 'react';
import {
    Comment, Tooltip, Avatar, Spin, Divider, Pagination, Rate,
} from 'antd';
import moment from 'moment';
import { getCommentList } from '@/services/CommentService';

class GoodsComment extends React.Component {
    state = {
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
                commentQO: {
                    ...this.state.commentQO,total:result.data.total
                },
            });
        });
    }

    //页码改变调用方法
    pageChange = (page) => {
        console.log(page);
        this.setState({
            commentQO: {
                ...this.state.commentQO,pageNum:page
            },
        }, () => this.reloadCommentList());

    };

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
                                        <div>
                                            <p>{comment.content}</p>
                                            <Rate disabled defaultValue={comment.starLevel} />
                                        </div>
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
                    <center>
                        <Pagination
                            size="small"
                            hideOnSinglePage={true}
                            pageSize={this.state.commentQO.pageSize}
                            defaultCurrent={1}
                            total={this.state.commentQO.total}
                            onChange={this.pageChange}/>
                    </center>
                </Spin>
            </div>
        );
    }
}

export default GoodsComment;
