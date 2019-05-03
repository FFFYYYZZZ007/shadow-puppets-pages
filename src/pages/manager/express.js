import React from 'react';
import {
    Table, Card, Row, Button, Input, Select, Modal, Radio, message,
} from 'antd';
import { getList, ship, changeExpressDeliveryStatus } from '@/services/ExpressService';

const Option = Select.Option;
const RadioGroup = Radio.Group;

class CategoryManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            visible: false,

            //正在操作的id和状态
            processId: '',
            processStatus: '',

            expressCode: '',
            expressCarrier: -1,

            pagination: {
                current: 1,
                pageSize: 8,
                total: 0,
            },
            expressDeliveryQO: {
                orderId: '',
                deliveryStatus: -1,
                expressCode: '',
                expressCarrier: -1,
            },
        };
        this.columns = [
            { title: '订单编号', dataIndex: 'id', width: '10%' },
            { title: '用户', dataIndex: 'userName', width: '10%' },
            { title: '快递单号', dataIndex: 'expressCode', width: '10%' },
            { title: '承运商', dataIndex: 'expressCarrier', width: '10%' },
            { title: '快递费', dataIndex: 'expressPrice', width: '10%' },
            { title: '状态', dataIndex: 'deliveryStatus', width: '10%' },
            { title: '发货时间', dataIndex: 'dateExpressStart', width: '10%' },
            { title: '到货时间', dataIndex: 'dateExpressEnd', width: '10%' },
            {
                title: '物流状态', dataIndex: 'changeStatus', width: '10%', render: (text, record) => {
                    if (record.deliveryStatus === '待发货') {
                        return (<Button onClick={() => this.showModal(record.id, record.deliveryStatus)}>发货</Button>);
                    }
                    if (record.deliveryStatus === '已发货') {
                        return (<Button onClick={() => this.showModal(record.id, record.deliveryStatus)}>揽件</Button>);
                    }
                    if (record.deliveryStatus === '配送中') {
                        return (<Button onClick={() => this.showModal(record.id, record.deliveryStatus)}>确认送达</Button>);
                    }
                    if (record.deliveryStatus === '已送达') {
                        return (<p>已送达</p>);
                    }
                },
            },
        ];
    }

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);//为true返回顶部，false为底部
        this.reloadList();
    }

    reloadList() {
        this.setState({
            loading: true,
        });
        let expressDeliveryQO = {
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            orderId: this.state.expressDeliveryQO.orderId,
            deliveryStatus: this.state.expressDeliveryQO.deliveryStatus,
            expressCode: this.state.expressDeliveryQO.expressCode,
            expressCarrier: this.state.expressDeliveryQO.expressCarrier,
        };

        getList(expressDeliveryQO).then((result) => {
            this.changeLoading();
            let data = [];
            if (result.data.list === undefined) {
                return;
            }
            result.data.list.map((expressInfo) => {
                data.push({
                    key: expressInfo.orderId,
                    id: expressInfo.orderId,
                    userName: expressInfo.userName,
                    expressCode: expressInfo.expressCode,
                    expressCarrier: expressInfo.expressCarrier,
                    expressPrice: expressInfo.expressPrice,
                    deliveryStatus: expressInfo.deliveryStatus,
                    dateExpressStart: expressInfo.dateExpressStart,
                    dateExpressEnd: expressInfo.dateExpressEnd,
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

    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
            this.handleCancel();
            this.reloadList();
        } else {
            message.error(result.msg, 1);
        }
    }

    pageChange(pageNum) {
        const pageInfo = { ...this.state.pagination };
        pageInfo.current = pageNum;
        this.setState({
            pagination: pageInfo,
        }, () => {
            this.reloadList();
        });
    }

    changeLoading() {
        this.setState({ loading: !this.state.loading });
    }

    orderKeywordChange(e) {
        this.setState({
            expressDeliveryQO: {
                ...this.state.expressDeliveryQO, orderId: e.target.value,
            },
        });
    }

    expressKeywordChange(e) {
        this.setState({
            expressDeliveryQO: {
                ...this.state.expressDeliveryQO, expressCode: e.target.value,
            },
        });
    }

    statusChange = (value) => {
        this.setState({
            expressDeliveryQO: {
                ...this.state.expressDeliveryQO, deliveryStatus: value,
            },
        });
    };

    carrierChange = (value) => {
        this.setState({
            expressDeliveryQO: {
                ...this.state.expressDeliveryQO, expressCarrier: value,
            },
        });
    };

    showModal = (id, status) => {
        this.setState({
            visible: true,
            processId: id,
            processStatus: status,
        });
        console.log(id, status);
    };

    handleOk = () => {
        if (this.state.processStatus === '待发货') {
            console.log(this.state.expressCode + this.state.expressCarrier);
            let shipQO = {
                orderId: this.state.processId,
                expressCode: this.state.expressCode,
                expressCarrier: this.state.expressCarrier,
            };
            if (this.state.expressCarrier === -1){
                message.error("请选择快递承运商");
                return;
            }
            if (this.state.expressCode === '') {
                message.error("请输入快递单号")
                return;
            }
            ship(shipQO).then((result) => {
                this.showMessage(result);
            });
        } else if (this.state.processStatus === '已发货') {
            //修改成配送中
            changeExpressDeliveryStatus(this.state.processId, 2).then((result) => {
                this.showMessage(result);
            });
        } else if (this.state.processStatus === '配送中') {
            //修改成已送达
            changeExpressDeliveryStatus(this.state.processId, 3).then((result) => {
                this.showMessage(result);
            });
        }
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            processId: '',
            processStatus: '',
            expressCode: '',
            expressCarrier: -1,
        });
    };

    expressCodeChange = (e) => {
        console.log(e.target.value);
        this.setState({
            expressCode: e.target.value,
        });
    };

    carrierRadioChange = (e) => {
        console.log(e.target.value);
        this.setState({
            expressCarrier: e.target.value,
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
                            <font size={3}>物流管理</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}/>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>
                        <div style={{ paddingBottom: 24 }}>
                            <Input style={{ width: 150 }} placeholder="订单编号" onChange={e => this.orderKeywordChange(e)}
                                   allowClear/>&nbsp;&nbsp;&nbsp;
                            <Input style={{ width: 150 }} placeholder="快递单号"
                                   onChange={e => this.expressKeywordChange(e)}
                                   allowClear/>&nbsp;&nbsp;&nbsp;
                            <Select style={{ width: 100 }} placeholder='状态' allowClear
                                    onChange={this.statusChange}>
                                <Option value="0" key={0}>待发货</Option>
                                <Option value="1" key={1}>已发货</Option>
                                <Option value="2" key={2}>配送中</Option>
                                <Option value="3" key={3}>已送达</Option>
                            </Select>&nbsp;&nbsp;&nbsp;
                            <Select style={{ width: 100 }} placeholder='承运商' allowClear
                                    onChange={this.carrierChange}>
                                <Option value="1" key={1}>顺丰</Option>
                                <Option value="2" key={2}>圆通</Option>
                                <Option value="3" key={3}>申通</Option>
                                <Option value="4" key={4}>EMS</Option>
                            </Select>&nbsp;&nbsp;&nbsp;
                            <Button type='primary' onClick={() => this.reloadList()}>搜索</Button>
                        </div>
                        <Table
                            loading={this.state.loading}
                            bordered
                            dataSource={this.state.data}
                            columns={this.columns}
                            pagination={paginationProps}
                        />
                    </div>
                    <Modal
                        title="修改物流状态"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        okText={'确认修改'}
                        cancelText={'取消'}
                        centered
                        destroyOnClose
                        onCancel={this.handleCancel}
                    >
                        {this.state.processStatus === '待发货' ?
                            <div>
                                <h1>发货</h1>
                                <span>订单号：</span> <Input onChange={this.expressCodeChange}/><br/><br/>
                                <RadioGroup onChange={this.carrierRadioChange}>
                                    <Radio value={1}>顺丰</Radio>
                                    <Radio value={2}>圆通</Radio>
                                    <Radio value={3}>申通</Radio>
                                    <Radio value={4}>EMS</Radio>
                                </RadioGroup>
                            </div>
                            :
                            null}
                        {this.state.processStatus === '已发货' ?
                            <div style={{ textAlign: 'center' }}>
                                <h1>确认揽件</h1>
                            </div>
                            :
                            null}
                        {this.state.processStatus === '配送中' ?
                            <div style={{ textAlign: 'center' }}>
                                <h1>确认送达</h1>
                            </div>
                            :
                            null}
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
}

export default CategoryManager;
