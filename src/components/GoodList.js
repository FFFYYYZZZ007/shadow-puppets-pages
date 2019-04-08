import React from 'react';
import { Row, Col } from 'antd';
import GoodCard from './GoodCard';

class GoodList extends React.Component {
    render() {
        return (
            <div>
                <Row style={{ paddingTop: 30 }}>
                    <Col span={6} align='middle'>
                        <GoodCard />
                    </Col>
                    <Col span={6} align='middle'>
                        <GoodCard />
                    </Col>
                    <Col span={6} align='middle'>
                        <GoodCard />
                    </Col>
                    <Col span={6} align='middle'>
                        <GoodCard />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GoodList;