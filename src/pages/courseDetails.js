import React from 'react';
import { createNewCourseOrder, getCourseVO, getRecommendCourseList } from '@/services/CourseService';
import { Avatar, Button, Card, Col, Comment, Divider, Icon, message, Row, Spin, Tabs, Tooltip } from 'antd';
import styles from './css/courseDetails.css';
import moment from 'moment';
import router from 'umi/router';

const TabPane = Tabs.TabPane;

class courseDetails extends React.Component {

    GetUrlByParamName(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let URL = decodeURI(window.location.search);
        let r = URL.substr(1).match(reg);
        if (r != null) {
            //decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码
            return decodeURI(r[2]);
        }
        return null;
    };

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
        let id = this.GetUrlByParamName('courseId');
        this.getCourseDetail(id);
        this.getRecommendList();
    }

    state = {
        course: {},
        spinning: false,
        tabKey: '1',
        recommend: [],
    };

    getCourseDetail(id) {
        this.setState({
            spinning: true,
        });
        getCourseVO(id).then((result) => {
            console.log(result);
            this.setState({
                course: result.data,
                spinning: false,
            });
        });
    }

    getRecommendList() {
        getRecommendCourseList().then((result) => {
            console.log(result);
            if (result.success) {
                this.setState({
                    recommend: result.data,
                });
            }
        });
    }


    callback = (key) => {
        console.log(key);
        console.log(key === '1');
        this.setState({
            tabKey: key,
        });
    };


    jump2CourseDetail(id) {
        console.log(id);
        if (window.location.href.match('courseDetails')) {
            window.location.href = '/courseDetails?courseId=' + id;
            return;
        }
    };

    createCourseOrder() {
        console.log(this.state.course);
        let courseOrder = {
            courseId: this.state.course.id,
            dealPrice: this.state.course.courseDiscountPrice,
        };
        createNewCourseOrder(courseOrder).then((result) => {
            this.showMessage(result);
            if (result.success === true) {
                router.push({
                    pathname: 'courseOrderInfo',
                    query: {
                        orderId: result.data,
                    },
                });
            }
        });
    }


    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
        } else {
            message.error(result.msg, 1);
        }
    }

    render() {
        return (
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Spin spinning={this.state.spinning}>
                    <h1 style={{
                        fontSize: 30,
                        fontFamily: '黑体',
                        textAlign: 'center',
                    }}>{this.state.course.courseName}</h1>
                    <div style={{ height: 30 }}/>
                    <div className={styles.detail_header}>
                        <div style={{ padding: 20 }}>
                            <strong style={{ fontSize: 30, color: 'red' }}>
                                ￥{this.state.course.courseDiscountPrice}&nbsp;&nbsp;&nbsp;&nbsp;
                            </strong>
                            <font style={{ fontSize: 15, textDecoration: 'line-through' }}>
                                原价：{this.state.course.courseOriginPrice}
                            </font>
                            <br/>
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={3}>
                                    <p style={{ fontSize: 15 }}>教师：&nbsp;{this.state.course.teacherName}</p>
                                </Col>
                                <Col offset={1} span={3}>
                                    <p style={{ fontSize: 15 }}>时长：&nbsp;{this.state.course.courseHours}&nbsp;小时</p>
                                </Col>
                                <Col offset={1} span={3}>
                                    <p style={{ fontSize: 15 }}>学习人数：&nbsp;{this.state.course.paidNumber}&nbsp;</p>
                                </Col>
                                <Col offset={1} span={3}>
                                    <p style={{ fontSize: 15 }}>地点：&nbsp;{this.state.course.coursePlace}&nbsp;</p>
                                </Col>
                                <Col offset={6} span={3}>
                                    <Button type={'primary'} onClick={() => this.createCourseOrder()}>立即购买</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div style={{ paddingTop: 30 }}>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="课程介绍" key='1'/>
                            <TabPane tab="课程评价" key='2'/>
                        </Tabs>
                        <Row gutter={30} style={{ paddingTop: 10 }}>
                            <Col span={18}>
                                {this.state.tabKey === '1' ?
                                    <div>
                                        <div className={styles.detail_introduce}>
                                            <div style={{ padding: 20 }}>
                                                简介：{this.state.course.courseIntroduction}
                                            </div>
                                        </div>
                                        <div style={{ height: 20 }}/>
                                        <div className={styles.detail_content}>
                                            <div style={{ padding: 20 }}>
                                                内容：{this.state.course.courseContent}
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={styles.comment}>
                                        <Comment

                                            author={<p>Han Solo</p>}
                                            avatar={(
                                                <Avatar
                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                    alt="Han Solo"
                                                />
                                            )}
                                            content={(
                                                <p>We supply a series of design principles, practical patterns and high
                                                    quality design resources (Sketch and Axure), to help people create
                                                    their product prototypes beautifully and efficiently.</p>
                                            )}
                                            datetime={(
                                                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                    <span>{moment().fromNow()}</span>
                                                </Tooltip>
                                            )}
                                        />
                                        <Divider/>
                                        <Comment

                                            author={<p>Han Solo</p>}
                                            avatar={(
                                                <Avatar
                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                    alt="Han Solo"
                                                />
                                            )}
                                            content={(
                                                <p>We supply a series of design principles, practical patterns and high
                                                    quality design resources (Sketch and Axure), to help people create
                                                    their product prototypes beautifully and efficiently.</p>
                                            )}
                                            datetime={(
                                                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                    <span>{moment().fromNow()}</span>
                                                </Tooltip>
                                            )}
                                        />

                                    </div>
                                }

                            </Col>
                            <Col span={6}>
                                <div>
                                    <b>推荐课程</b><br/><br/>
                                    <div>
                                        {this.state.recommend.map((course) => {
                                            return (
                                                <div key={course.id}>
                                                    <Card hoverable={true} bordered={false} style={{height:100}}>
                                                        <Row>
                                                            <Col span={6}>
                                                                <img onClick={() => this.jump2CourseDetail(course.id)}
                                                                     className={styles.img_recommend} alt={''}
                                                                     src={course.mainImageUrl}/>
                                                            </Col>
                                                            <Col offset={4} span={14}>
                                                                <p>{course.courseName}</p>
                                                                <p>
                                                                    <Icon type="user"/>
                                                                    &nbsp;&nbsp;{course.paidNumber}
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                    <Divider/>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </Spin>
            </div>
        );
    }
}

export default courseDetails;
