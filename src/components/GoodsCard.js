import React from 'react';
import { Card } from 'antd';
import router from 'umi/router';

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
                    cover={<img style={{ height: 220 }} alt="" src={this.props.imgSrc} />}
                >
                    <Meta
                        title={
                            <div>
                                <font style={{ float: 'left' }} color="#F40" >￥{this.props.price}</font>
                                <font style={{ float: 'right' }} color="#888" >剩余 {this.props.quantity}</font>
                            </div>}
                        description={
                            <div>
                                <font style={{ float: 'left' }} color="#404040" >{this.props.title}</font>
                            </div>}
                    />
                </Card>
            </React.Fragment>
        );
    }
}

export default GoodsCard;