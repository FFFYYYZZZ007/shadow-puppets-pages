import React from 'react';
import {
    Comment, Icon, Tooltip, Avatar, Form, Button, Input,
} from 'antd';
import moment from 'moment';
const TextArea = Input.TextArea;
class GoodsComment extends React.Component {
    state = {
        likes: 0,
        dislikes: 0,
        action: null,
    }

    like = () => {
        this.setState({
            likes: 1,
            dislikes: 0,
            action: 'liked',
        });
    }

    dislike = () => {
        this.setState({
            likes: 0,
            dislikes: 1,
            action: 'disliked',
        });
    }

    render() {
        const { likes, dislikes, action } = this.state;

        const actions = [
            <span>
                <Tooltip title="Like">
                    <Icon
                        type="like"
                        theme={action === 'liked' ? 'filled' : 'outlined'}
                        onClick={this.like}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                    {likes}
                </span>
            </span>,
            <span>
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={action === 'disliked' ? 'filled' : 'outlined'}
                        onClick={this.dislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                    {dislikes}
                </span>
            </span>,
            <span>回复</span>,
        ];

        return (
            <React.Fragment>
                <Comment
                    actions={actions}
                    author={'傅宇'}
                    avatar={(
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="傅宇"
                        />
                    )}
                    content={(
                        <p>这个商品非常不错</p>
                    )}
                    datetime={(
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    )}
                />
                <Comment
                    actions={actions}
                    author={'傅宇'}
                    avatar={(
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="傅宇"
                        />
                    )}
                    content={(
                        <p>这个商品非常不错</p>
                    )}
                    datetime={(
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    )}
                />
                <Comment
                    actions={actions}
                    author={'傅宇'}
                    avatar={(
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="傅宇"
                        />
                    )}
                    content={(
                        <p>这个商品非常不错</p>
                    )}
                    datetime={(
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    )}
                />
                <Comment
                    actions={actions}
                    author={'傅宇'}
                    avatar={(
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="傅宇"
                        />
                    )}
                    content={(
                        <p>这个商品非常不错</p>
                    )}
                    datetime={(
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    )}
                />
                <div>
    <Form.Item>
      <TextArea rows={4}  />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </div>
            </React.Fragment>
        );
    }
}

export default GoodsComment;