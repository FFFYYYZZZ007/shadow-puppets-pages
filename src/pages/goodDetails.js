import React from 'react';
import GoodInfo from '../components/GoodInfo';
import GoodDetail from '../components/GoodDetail';
import GoodCard from '../components/GoodCard';
import { Row, Col } from 'antd';

export default function () {
    return (
        <div>
            <GoodInfo />
            <Row  style={{ padding: 50}}>
                <Col span={5} align='middle'>
                    <h2>热销排行榜</h2>
                    <GoodCard/>
                </Col>
                <Col span={18}>
                    <GoodDetail />
                </Col>
            </Row>

        </div>
    );
}
