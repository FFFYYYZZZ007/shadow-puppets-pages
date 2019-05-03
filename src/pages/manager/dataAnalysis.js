import React from 'react';
import { ChartCard, Field, MiniBar, MiniProgress, Bar, MiniArea, Pie } from 'ant-design-pro/lib/Charts';
import { Row, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import { userDateAnalysis, orderDateAnalysis, priceDateAnalysis, goodsGroupByCategory } from '@/services/Analysis';
import 'ant-design-pro/dist/ant-design-pro.css';

const salesData = [];
for (let i = 0; i < 12; i += 1) {
    salesData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200,
    });
}

class dateAnalysis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userCountData: {
                countUser: 0,
                countOnlineWeek: 0,
                onlinePercent: 0,
            },
            orderCountData: {
                countGoodsOrder: 0,
                countOrderCreateMonth: 0,
                xyDataList: [],
            },
            priceData: {
                totalSellPrice: 0,
                monthSellPrice: 0,
                xyDataList: [],
            },
            goodsGroupByCategory: {
                xyDataList: [],
            },
            loading: {
                userCountDataLoading: false,
                orderCountDataLoading: false,
                priceDataLoading: false,
                goodsGroupByCategoryList: false,
            },
        };


        this.getUserCountData();
        this.getOrderCountData();
        this.getPriceData();
        this.getGoodsGroupByCategoryList();
    }

    getUserCountData() {
        userDateAnalysis().then((result) => {
            this.setState({
                userCountData: result.data,
            });
        });
    };

    getOrderCountData() {
        orderDateAnalysis().then((result) => {
            this.setState({
                orderCountData: result.data,
            });
        });
    }

    getPriceData() {
        priceDateAnalysis().then((result) => {
            this.setState({
                priceData: result.data,
            });
        });
    }

    getGoodsGroupByCategoryList() {
        goodsGroupByCategory().then((result) => {
            this.setState({
                goodsGroupByCategory: result.data,
            });
        });
    }


    render() {

        return (
            <React.Fragment>
                <div>
                    <Row gutter={30} style={{ marginTop: 10 }}>
                        <Col span={8}>
                            <ChartCard
                                title="用户总量"
                                action={
                                    <Tooltip title="用户总量">
                                        <Icon type="info-circle-o"/>
                                    </Tooltip>
                                }
                                total={numeral(this.state.userCountData.countUser).format('0,0')}
                                footer={<Field label="周登录用户"
                                               value={numeral(this.state.userCountData.countOnlineWeek).format('0,0')}/>}
                                contentHeight={46}
                            >
                                周在线比例: {this.state.userCountData.onlinePercent + '%'}
                                <MiniProgress percent={this.state.userCountData.onlinePercent} strokeWidth={8}
                                              target={20}/>
                            </ChartCard>
                        </Col>
                        <Col span={8}>
                            <ChartCard
                                title="总订单数"
                                action={
                                    <Tooltip title="总订单数">
                                        <Icon type="info-circle-o"/>
                                    </Tooltip>
                                }
                                total={numeral(this.state.orderCountData.countGoodsOrder).format('0,0')}
                                footer={<Field label="月订单数"
                                               value={numeral(this.state.orderCountData.countOrderCreateMonth).format('0,0')}/>}
                                contentHeight={46}
                            >
                                <MiniBar height={46} data={this.state.orderCountData.xyDataList}/>
                            </ChartCard>
                        </Col>
                        <Col span={8}>
                            <ChartCard
                                title="销售额"
                                action={
                                    <Tooltip title="销售额">
                                        <Icon type="info-circle-o"/>
                                    </Tooltip>
                                }
                                total={numeral(this.state.priceData.totalSellPrice).format('0,0')}
                                footer={
                                    <Field label="月销售额"
                                           value={numeral(this.state.priceData.monthSellPrice).format('0,0')}/>
                                }
                                contentHeight={46}
                            >
                                <MiniArea line height={46} data={this.state.priceData.xyDataList}/>
                            </ChartCard>
                        </Col>
                    </Row>
                </div>

                <div style={{ paddingTop: 20 }}>
                    <Row gutter={30}>
                        <Col span={8}>
                            <ChartCard
                                title="商品分类"
                                style={{}}
                            >
                                <Pie
                                    hasLegend
                                    title="商品分类"
                                    subTitle="商品总数"
                                    total={() => (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: (this.state.goodsGroupByCategory.xyDataList.reduce((pre, now) => now.y + pre, 0)),
                                            }}
                                        />
                                    )}
                                    data={this.state.goodsGroupByCategory.xyDataList}
                                    valueFormat={val => <span dangerouslySetInnerHTML={{ __html: (val) }}/>}
                                    height={110}
                                />
                            </ChartCard>
                        </Col>
                        <Col span={16}>
                            <ChartCard>
                                <Bar
                                    // padding={[4,4,4,4]}
                                    height={249}
                                    title="销售额趋势"
                                    data={this.state.priceData.xyDataList}/>
                            </ChartCard>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default dateAnalysis;
