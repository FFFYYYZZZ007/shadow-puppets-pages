import React from 'react';
import { Tabs, Icon, Row, Col, Card, Spin, Tooltip } from 'antd';
import styles from '@/pages/css/course.css';
import { getCourseList } from '@/services/CourseService';
import router from 'umi/router';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const TabPane = Tabs.TabPane;
class CourseMenu extends React.Component {

    componentDidMount() {
        this.courseList();
    }

    state = {
        spinning: false,
        list: [],
    };

    courseList() {
        let courseQO = {
            pageNum: 1,
            pageSize: 8,
        };
        this.setState({
            spinning: true,
        });
        getCourseList(courseQO).then((result) => {
            let pageVO = result.data;
            this.setState({
                spinning: false,
                list: pageVO.list,
            });
        });
    }

    jump2CourseDetail(id) {
        console.log(id);
        router.push({
            pathname: '/courseDetails',
            query: {
                courseId: id,
            },
        });
    };
    render() {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="2" style={{ paddingTop: 30 }}>
                    <TabPane tab={<span><Icon type="read" />推荐课程</span>} key="1">
                        <Spin spinning={this.state.spinning}>
                            <div style={{paddingLeft:30,paddingRight:30}}>
                            <Row gutter={60} >
                                {this.state.list.map((course) => {
                                    return (
                                        <Col span={6} key={course.id}>
                                            <div style={{ paddingTop: 10 }}>
                                                <Card
                                                    bordered={false}
                                                    className={styles.card}
                                                    onClick={() => this.jump2CourseDetail(course.id)}
                                                    hoverable
                                                    bodyStyle={{ height: 210, padding: 0 }}
                                                >
                                                    <img className={styles.img} alt=""
                                                         src={course.mainImageUrl}/>
                                                    <div style={{ paddingLeft: 20, paddingTop: 10 }}>
                                                        <b style={{ fontSize: 16, fontFamily: '宋体' }}
                                                        >
                                                            <Tooltip title={course.courseName}>
                                                                <Ellipsis length={8}>{course.courseName}</Ellipsis>
                                                            </Tooltip>
                                                        </b>
                                                        <div style={{ color: '#888' }}>
                                                            <b style={{
                                                                fontSize: 15,
                                                                color: 'red',
                                                            }}>￥&nbsp;{course.courseDiscountPrice}</b>
                                                            <font style={{ fontSize: 15, float: 'right' }}>
                                                                <Icon type="user"/>
                                                                &nbsp;&nbsp;&nbsp;
                                                                {course.paidNumber}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </font>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>

                                        </Col>
                                    );
                                })}
                            </Row>
                            </div>
                            <Row>
                                &nbsp;
                            </Row>
                        </Spin>
                    </TabPane>
                </Tabs>

                <div style={{height:20}}/>
            </React.Fragment>
        );
    }
}

export default CourseMenu;
