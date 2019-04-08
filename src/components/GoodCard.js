import React from 'react';
import { Card } from 'antd';
import router from 'umi/router';

const { Meta } = Card;
class GoodCard extends React.Component {
    render() {
        function qwe(){
            router.push('/goodDetails');
        }
        return (
            <React.Fragment>
                <Card onClick={qwe}
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="" src="http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/20190403/jpg/c28821b2ef0eaac3d76d86aecece29ec.jpg" />}
                >
                    <Meta
                        title="这是一个皮影戏商品"
                        description="这是这个皮影戏商品的一点简介"
                    />
                </Card>
            </React.Fragment>
        );
    }
}

export default GoodCard;