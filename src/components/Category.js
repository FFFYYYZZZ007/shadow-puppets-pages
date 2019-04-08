import React from 'react';
import { Divider, Row, Col } from 'antd';

class Category extends React.Component {
    render() {
        return (

            <div style={{ paddingTop: 30 }}>
                <div>
                    <Row gutter={4} style={{ textAlign: 'center' }}>
                        <Col span={2}><h3>分类</h3></Col>
                        <Col span={1}><Divider type="vertical" /></Col>
                        <Col span={2}>
                        全部</Col>
                        <Col span={2}>类别一</Col>
                        <Col span={2}>类别二</Col>
                        <Col span={2}>类别三</Col>
                        <Col span={2}>类别四</Col>
                    </Row>
                    <hr />
                    <Row gutter={4} style={{ textAlign: 'center' }}>
                        <Col span={2}><h3>排序</h3></Col>
                        <Col span={1}><Divider type="vertical"/></Col>
                        <Col span={2}>默认</Col>
                        <Col span={2}>价格</Col>
                        <Col span={2}>上架时间</Col>
                        <Col span={2}>销量</Col>
                    </Row>
                    <hr/>
                </div>
            </div>

        );
    }
}

export default Category;