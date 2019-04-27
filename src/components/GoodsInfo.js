import React from 'react';
import styles from '../pages/css/order.css';
import { Row, Col, Button, message, InputNumber } from 'antd';
import { addShoppingCart } from '../services/ShoppingCartService';
import { addNewGoodsOrder } from '../services/GoodsOrderService';
import router from 'umi/router';

class GoodsInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            num: 1,
        };
        this.onChange = this.onChange.bind(this);
        this.addShoppingCart = this.addShoppingCart.bind(this);
        this.buyNow = this.buyNow.bind(this);
    }


    addShoppingCart(goodsId) {
        let cart = {
            'goodsId': goodsId,
            'num': this.state.num,
        };
        addShoppingCart(cart).then((result) => {
            if (result.success === true) {
                message.success(result.msg, 10);
            } else {
                message.error(result.msg, 10);
            }
        });
    };

    buyNow(goodsId) {
        let order = {
            'goodsOrderSimpleBOList': [
                {
                    'goodsId': goodsId,
                    'num': this.state.num,
                },
            ],
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

    //数量变化函数
    onChange(value) {
        console.log('changed', value);
        this.setState({
            num: value,
        });
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={12} align='middle'>
                        <img alt='' className={styles.card} style={{ width: 450, height: 350 }}
                             src={this.props.imageUrl}/>
                    </Col>
                    <Col span={12}>

                        <Row style={{ textAlign: 'center', height: 50 }}><h2>{this.props.title}</h2></Row>

                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>售价</Col>
                            <Col span={18}><h1
                                style={{ color: 'blue', display: 'inline' }}>{this.props.price} </h1>&nbsp;&nbsp;元</Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>库存</Col>
                            <Col span={18}><h1
                                style={{ color: 'red', display: 'inline' }}>{this.props.maxNum}</h1>&nbsp;&nbsp;个</Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>服务</Col>
                            <Col span={18}>30天无忧退货 48小时极速退款</Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>尺寸</Col>
                            <Col span={3}>30cm</Col>
                            <Col span={2}>*</Col>
                            <Col span={3}>30cm</Col>
                            <Col span={10}/>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6} align='middle'>数量</Col>
                            <Col span={18}>
                                <InputNumber min={1} max={this.props.maxNum} defaultValue={1}
                                             onChange={(value) => this.onChange(value)}/>,
                            </Col>
                        </Row>
                        <Row style={{ height: 50 }} type="flex" justify="space-around" align="middle">
                            <Col span={6}/>
                            <Col span={6}>
                                <Button onClick={() => this.addShoppingCart(this.props.goodsId)}>加入购物车</Button>
                            </Col>
                            <Col span={6}>
                                <Button onClick={() => this.buyNow(this.props.goodsId)}>立即购买</Button>
                            </Col>
                            <Col span={6}/>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GoodsInfo;
