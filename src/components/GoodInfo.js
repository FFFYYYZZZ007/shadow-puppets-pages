import React from 'react';

import { Row, Col } from 'antd';
import { Button } from 'antd';

const ButtonGroup = Button.Group;
class GoodInfo extends React.Component {
    render() {
        return (
            <div>
                <Row>
                    <Col span={12} align='middle'>
                        <img alt='' style={{ width: 450, height: 350 }} src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554564898560&di=60a92e53e364966f9f63542c52f93381&imgtype=0&src=http%3A%2F%2Fwww.ctnews.com.cn%2Fpicture%2F0%2F1803021416039653926.jpg' />
                    </Col>
                    <Col span={12}>

                        <Row style={{ textAlign: 'center', height: 50 }}><h2>皮影戏的名字啊啊啊啊</h2></Row>

                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>售价</Col>
                            <Col span={18}><h1 style={{ color: 'blue' }}>88.88</h1></Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>评价</Col>
                            <Col span={18} ><h1 style={{ color: 'red' }} >100</h1></Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>服务</Col>
                            <Col span={18} >30天无忧退货 48小时极速退款</Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>尺寸</Col>
                            <Col span={3}>30cm</Col>
                            <Col span={2}>*</Col>
                            <Col span={3}>30cm</Col>
                            <Col span={10}></Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>数量</Col>
                            <Col span={18} >
                                <ButtonGroup>
                                    <Button>-</Button>
                                    <Button>1</Button>
                                    <Button>+</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} ></Col>
                            <Col span={6}>
                                <Button>加入购物车</Button>
                            </Col>
                            <Col span={6}>
                                <Button>立即购买</Button>
                            </Col>
                            <Col span={6}></Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default GoodInfo;