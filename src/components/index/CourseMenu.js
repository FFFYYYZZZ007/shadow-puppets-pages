import React from 'react';
import { Tabs, Icon, Row, Col, Card, Spin,  } from 'antd';
import styles from '@/pages/css/course.css';
import { getCourseList } from '@/services/CourseService';
import router from 'umi/router';

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
                            <Row gutter={40}>
                                {this.state.list.map((course) => {
                                    return (
                                        <Col span={6} key={course.id}>
                                            <div
                                                style={{ paddingTop: 10 }}
                                            >
                                                <Card
                                                    bordered={false}
                                                    className={styles.card}
                                                    onClick={() => this.jump2CourseDetail(course.id)}
                                                    hoverable
                                                    bodyStyle={{height:240}}
                                                >
                                                    <img className={styles.img} alt=""
                                                         src={course.mainImageUrl}/>
                                                    <div style={{ paddingTop: 10 }}>
                                                        &nbsp;&nbsp;&nbsp;
                                                        <b style={{ fontSize: 20, fontFamily: '宋体' }}
                                                        >
                                                            {course.courseName}
                                                        </b>
                                                        <p style={{ color: '#888' }}>
                                                            &nbsp;&nbsp;&nbsp;已参加人数&nbsp;&nbsp;&nbsp;
                                                            <Icon type="user"/>
                                                            &nbsp;&nbsp;&nbsp;{course.paidNumber}
                                                        </p>
                                                    </div>
                                                </Card>
                                            </div>
                                        </Col>
                                    );
                                })}
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
