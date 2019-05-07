import React from 'react';
import { Table, Button, Popconfirm, message, Tooltip } from 'antd';
import styles from './css/shoppingCart.css';
import { connect } from 'dva';
import router from 'umi/router';
import { addNewGoodsOrder } from '../services/GoodsOrderService';
import { deleteOneShoppingCart, deleteAllShoppingCart } from '@/services/ShoppingCartService';


const namespace = 'shoppingCart';

const mapStateToProps = (state) => {
    const shoppingCartList = state[namespace].shoppingCartList;
    console.log(shoppingCartList);
    return {
        shoppingCartList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: () => {
            const action = {
                type: `${namespace}/getShoppingCartList`,
            };
            dispatch(action);
        },
    };
};
let list = [];

@connect(mapStateToProps, mapDispatchToProps)
class ShoppingCart extends React.Component {

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    };

    constructor(props) {
        super(props);
        this.goPay = this.goPay.bind(this);
    }

    componentDidMount() {
        this.props.onDidMount();
    }

    columns = [{
        title: '商品',
        dataIndex: 'goodsName',
        render: text => <div>{text}</div>,
    }, {
        title: '金额',
        dataIndex: 'price',
    }, {
        title: '数量',
        dataIndex: 'num',
    }, {
        title: '操作',
        render: (text, record) =>
            <div>
                <Popconfirm title="确定删除?" onConfirm={() => {
                    this.handleDelete(record.key);
                }}>
                    <Button type="danger" icon="delete" shape='circle'/>
                </Popconfirm>
                &nbsp;&nbsp;&nbsp;
                <Tooltip title={'商品详情'}>
                    <Button icon="info" shape='circle' onClick={() => {
                        router.push('/goodsDetails?' + record.goodsId);
                    }}/>
                </Tooltip>
            </div>,
    }];


    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            list = selectedRowKeys;
        },
    };
    handleDelete = (key) => {
        deleteOneShoppingCart(key).then((result) => {
            this.showMessage(result);
        });
    };

    handleDeleteAll = () => {
        deleteAllShoppingCart().then((result) => {
            this.showMessage(result);
        });
    };

    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
            this.props.onDidMount();
        } else {
            message.error(result.msg, 1);
        }
    }

    goPay() {
        console.log(list);
        //生成一个订单
        let order = {
            'shoppingCartIdList': list,
        };
        addNewGoodsOrder(order).then((result) => {
            if (result.success === true) {
                message.success(result.msg, 5);
                //跳转到该订单的支付页
                router.push({
                    pathname: '/orderInfo',
                    query: {
                        orderId: result.data,
                    },
                });
            } else {
                message.error(result.msg, 5);
            }

        });

    }

    render() {
        return (
            <div style={{ paddingLeft: 150, paddingRight: 150 }}>
                <div className={styles.cart} style={{ padding: 30 }}>
                    <div>
                        <span style={{ fontSize: 25 }}>我的购物车</span>
                        <Button onClick={this.handleDeleteAll} type='default' style={{ float: 'right' }}>清空购物车</Button>
                    </div>
                    <Table
                        style={{ paddingTop: 10 }} bordered
                        rowSelection={this.rowSelection} columns={this.columns}
                        dataSource={this.props.shoppingCartList}/>
                    <Button type='primary' style={{ float: 'right' }}
                            onClick={this.goPay}
                    >去结算</Button>
                    <div style={{ height: 10 }}></div>
                </div>
            </div>
        );
    }

}

export default ShoppingCart;
