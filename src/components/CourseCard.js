import React from 'react';
import { Card, Icon } from 'antd';

const { Meta } = Card;
class CourseCard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Card
                    hoverable
                    style={{ width: 300 }}
                    cover={<img alt="" style={{ height: 200 }} src="http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/20190403/jpg/48d216083f99b7bb517a4a09a9d5409b.jpg" />}
                >
                    <Meta
                        title="这是一个皮影戏课程"
                    />
                    <div style={{ paddingTop: 5 }}>
                        ￥88.88
                        <Icon type='user' style={{ paddingLeft: 20 }} />111
                        <Icon type="star" theme="filled" style={{ color: 'yellow', paddingLeft: 20 }} />
                        <Icon type="star" theme="filled" style={{ color: 'yellow' }} />
                        <Icon type="star" theme="filled" style={{ color: 'yellow' }} />
                        <Icon type="star" theme="filled" style={{ color: 'yellow' }} />
                        <Icon type="star" theme="filled" style={{ color: 'yellow' }} />
                    </div>

                </Card>
            </React.Fragment>
        );
    }
}

export default CourseCard;