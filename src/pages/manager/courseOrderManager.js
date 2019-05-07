import React from 'react';
import {
    Table, Card, Row, Button, Input, Select, Popconfirm, message,
} from 'antd';
import router from 'umi/router';
import { endCourse, getCourseOrderList } from '@/services/CourseService';

const Option = Select.Option;

class courseOrderManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,

            keyword: '',
            orderStatus: -1,

            pagination: {
                current: 1,
                pageSize: 8,
                total: 0,
            },
        };
        this.columns = [
            { title: '订单编号', dataIndex: 'id', width: '10%' },
            { title: '用户', dataIndex: 'userName', width: '10%' },
            { title: '订单价格', dataIndex: 'dealPrice', width: '10%' },
            { title: '订单状态', dataIndex: 'courseOrderStatus', width: '10%' },
            { title: '创建时间', dataIndex: 'dateCreate', width: '12%' },
            { title: '最近修改时间', dataIndex: 'dateUpdate', width: '12%' },
            {
                title: '操作', dataIndex: 'caozuo', width: '16%', render: (text, record) => {
                    return (
                        record.courseOrderStatus === '待学习' ?
                            <div>
                                <Button onClick={() => {
                                    router.push({
                                        pathname: '/courseDetails',
                                        query: {
                                            courseId: record.courseId,
                                        },
                                    });
                                }}>课程详情</Button>&nbsp;&nbsp;
                                <Popconfirm title="确定结课？"
                                            onConfirm={() => {
                                                endCourse(record.id).then((result) => {
                                                    this.showMessage(result);
                                                    this.reloadCourseOrderList();
                                                });
                                            }}
                                            okText="确定"
                                            cancelText="不确定">
                                    <Button>结课</Button>
                                </Popconfirm>
                            </div>
                            :
                            <Button onClick={() => {
                                router.push({
                                    pathname: '/courseDetails',
                                    query: {
                                        courseId: record.courseId,
                                    },
                                });
                            }}>课程详情</Button>
                    );
                },
            },
        ];
    }


    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
        } else {
            message.error(result.msg, 1);
        }
    }

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);//为true返回顶部，false为底部
        this.reloadCourseOrderList();
    }

    reloadCourseOrderList() {
        this.setState({
            loading: true,
        });

        let courseOrderQO = {
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            keyword: this.state.keyword,
            courseOrderStatus: this.state.orderStatus,
        };

        getCourseOrderList(courseOrderQO).then((result) => {
            this.changeLoading();
            let data = [];
            result.data.list.map((order) => {
                data.push({
                    key: order.id,
                    id: order.id,
                    userName: order.userName,
                    dealPrice: order.dealPrice,
                    courseOrderStatus: order.courseOrderStatus,
                    dateCreate: order.dateCreate,
                    dateUpdate: order.dateUpdate,
                    courseId: order.courseVO.id,
                });
                return null;
            });
            this.setState({
                data: data,
                pagination: {
                    current: result.data.pageNum,
                    pageSize: result.data.pageSize,
                    total: result.data.total,
                },
            });
            console.log(this.state.data);
        });
    }

    changeLoading() {
        this.setState({ loading: !this.state.loading });
    }

    pageChange(pageNum) {
        const pageInfo = { ...this.state.pagination };
        pageInfo.current = pageNum;
        this.setState({
            pagination: pageInfo,
        }, () => {
            this.changeGoodsOrderList();
        });
    }

    orderStatusChange = (value) => {
        this.setState({
            orderStatus: value,
        });
    };

    render() {

        const paginationProps = {
            ...this.state.pagination,
            onChange: (current) => this.pageChange(current),
        };

        return (
            <React.Fragment>
                <div style={{ background: '#fff' }}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-around" align="middle">
                            <font size={3}>课程订单</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}/>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>

                        <div style={{ paddingBottom: 24 }}>
                            <Input style={{ width: 150 }} placeholder="订单编号" onChange={e => {
                                this.setState({
                                    keyword: e.target.value,
                                });
                            }}
                                   allowClear/>&nbsp;&nbsp;&nbsp;
                            <Select style={{ width: 100 }} placeholder='状态' allowClear
                                    onChange={this.orderStatusChange}>
                                <Option value="0" key={0}>待付款</Option>
                                <Option value="1" key={1}>待学习</Option>
                                <Option value="2" key={2}>待确认结课</Option>
                                <Option value="3" key={3}>待评价</Option>
                                <Option value="4" key={4}>已完成</Option>
                                <Option value="5" key={5}>已关闭</Option>
                            </Select>&nbsp;&nbsp;&nbsp;
                            <Button type='primary' onClick={() => this.reloadCourseOrderList()}>搜索</Button>
                        </div>

                        <Table
                            loading={this.state.loading}
                            bordered
                            dataSource={this.state.data}
                            columns={this.columns}
                            pagination={paginationProps}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default courseOrderManager;
