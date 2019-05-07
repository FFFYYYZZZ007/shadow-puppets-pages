import React from 'react';
import { Card, Tooltip } from 'antd';
import router from 'umi/router';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const { Meta } = Card;

class GoodsCard extends React.Component {
    render() {
        function details(goodsId) {
            router.push('/goodsDetails?' + goodsId);
        }

        return (
            <React.Fragment>
                <Card onClick={() => details(this.props.id)}
                      hoverable
                      style={{ width: 240 }}
                      cover={<img style={{ height: 220 }} alt="" src={this.props.imgSrc}/>}
                >
                    <Meta
                        title={
                            <div>
                                <b style={{ float: 'left', fontSize: 20, color: '#F40' }}>￥{this.props.price}</b>
                                <font style={{ float: 'right' }} color="#888">剩余 {this.props.quantity}</font>
                            </div>}
                        description={
                            <div>
                                <font style={{ float: 'left' }} color="#404040">
                                    <Tooltip title={this.props.title}>
                                        <Ellipsis length={12}>{this.props.title}</Ellipsis>
                                    </Tooltip>
                                </font>
                            </div>}
                    />
                </Card>
            </React.Fragment>
        );
    }
}

export default GoodsCard;
