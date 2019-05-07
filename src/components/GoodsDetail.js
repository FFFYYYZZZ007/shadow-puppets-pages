import React from 'react';
import { Tabs, Row, Col } from 'antd';
import GoodsComment from './GoodsComment';

const TabPane = Tabs.TabPane;

class GoodsDetail extends React.Component {

    render() {
        function callback(key) {
            console.log(key);
        }
        return (
            <div style={{ width: 900 }}>
                <Row gutter={16}>
                    <Col span={1}>

                    </Col>
                    <Col span={22}>
                        <Tabs onChange={callback} type="card">
                            <TabPane tab="商品详情" key="1">
                                {/*<p>商品简介：{this.props.introduction}</p>*/}
                                {this.props.imagesUrls.split(',').map(url => {
                                    return (
                                        <img alt=''
                                             style={{ width: 790 }}
                                             src={url}
                                             key={url}
                                        />
                                    );
                                })}
                            </TabPane>
                            <TabPane tab="商品评价" key="2">
                                <GoodsComment goodsId={this.props.goodsId}/>
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

export default GoodsDetail;
