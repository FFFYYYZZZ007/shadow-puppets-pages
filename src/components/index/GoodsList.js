import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import GoodsCard from '../GoodsCard';


const namespace = 'goodsList';

const mapStateToProps = (state) => {
    const goodsList = state[namespace].list;
    return {
        goodsList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: () => {
            const action = {
                type: `${namespace}/getGoodsList`,
                payload: {
                    pageNum: 1,
                    pageSize:8
                }
            };
            dispatch(action);
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class GoodsList extends React.Component {

    componentDidMount() {
        this.props.onDidMount();
    }

    render() {
        return (
            <div>
                <Row style={{ paddingTop: 30 }}>
                    {this.props.goodsList.list === undefined ? null :
                        this.props.goodsList.list.map(goods => {
                            return (
                                <Col span={6} align='middle' style={{ paddingBottom: 30 }} key={goods.id}>
                                    <GoodsCard
                                        imgSrc={goods.mainImageUrl}
                                        id={goods.id}
                                        price={goods.price}
                                        quantity={goods.quantity}
                                        title={goods.goodsName} />
                                </Col>
                            );
                        })
                    }
                </Row>
            </div>
        );
    }
}

export default GoodsList;