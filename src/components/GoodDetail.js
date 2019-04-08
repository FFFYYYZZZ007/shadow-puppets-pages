
import React from 'react';
import { Tabs, Row, Col } from 'antd';
import GoodComment from './GoodComment';

const TabPane = Tabs.TabPane;

class GoodDetail extends React.Component {

    render() {
        function callback(key) {
            console.log(key);
        };

        return (
            <div>
                <Row gutter={16}>
                    <Col span={1}>

                    </Col>
                    <Col span={22}>
                        <Tabs onChange={callback} type="card">
                            <TabPane tab="商品详情" key="1">
                                <p>商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介</p>
                                <p>商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介</p>
                                <p>商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介</p>
                                <p>商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介商品简介</p>
                                <img alt='' style={{ width: 450, height: 350 }} src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554564898560&di=60a92e53e364966f9f63542c52f93381&imgtype=0&src=http%3A%2F%2Fwww.ctnews.com.cn%2Fpicture%2F0%2F1803021416039653926.jpg' />

                            </TabPane>
                            <TabPane tab="商品评价" key="2">
                            <GoodComment/>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={1}>
                    </Col>
                </Row>


            </div>
        );
    }
}
export default GoodDetail;