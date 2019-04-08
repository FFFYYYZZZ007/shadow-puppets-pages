import React from 'react';
import { Row, Col } from 'antd';
import CourseCard from './CourseCard';

class CourseList extends React.Component {
    render() {
        return (

            <div style={{ paddingTop: 30 }}>
                <Row gutter={16}>
                    <Col span={8} align='middle'>
                        <CourseCard/>
                    </Col>
                    <Col span={8} align='middle'>
                        <CourseCard/>
                    </Col>
                    <Col span={8} align='middle'>
                        <CourseCard/>
                    </Col> 
                </Row>
            </div>

        );
    }
}

export default CourseList;