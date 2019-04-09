import React from 'react';
import GoodsInfo from '../components/GoodsInfo';
import GoodsDetail from '../components/GoodsDetail';
import { Row, Col, Card } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'react-router';

const namespace = 'goodsDetails';

const mapStateToProps = (state) => {
    const goodsDetails = state[namespace].goodsDetails;
    console.log(goodsDetails.imagesUrls)
    return {
        goodsDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: (id) => {
            const action = {
                type: `${namespace}/getGoodsDetails`,
                payload: id,
            };
            dispatch(action);
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class goodsDetails extends React.Component {
    
    // componentWillUpdate() {
    //     document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    // }

    componentDidMount() {
        let id = this.props.location.search.substr(1);
        this.props.onDidMount(id);
    }

    render() {
        let goodsDetails = this.props.goodsDetails;
        return (
            <div>
                {
                    goodsDetails.imagesUrls === undefined ? null :
                        <div>
                            <GoodsInfo
                                goodsId={goodsDetails.id}
                                title={goodsDetails.goodsName}
                                price={goodsDetails.price}
                                maxNum={goodsDetails.quantity}
                                imageUrl={goodsDetails.mainImageUrl}
                            />
                            <Row style={{ padding: 50 }}>
                                <Col span={5} >
                                    <h2 style={{ textAlign: 'center' }}>皮影戏小知识</h2>
                                    <Card>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;皮影戏(Shadow Puppets)，又称“影子戏”或“灯影戏”，是一种以兽皮或纸板做成的人物剪影以表演故事的民间戏剧。表演时，艺人们在白色幕布后面，一边操纵影人，一边用当地流行的曲调讲述故事，同时配以打击乐器和弦乐，有浓厚的乡土气息。其流行范围极为广泛，并因各地所演的声腔不同而形成多种多样的皮影戏。
                                    </Card>
                                </Col>
                                <Col span={18}>
                                    <GoodsDetail
                                        introduction={goodsDetails.introduction}
                                        imagesUrls={goodsDetails.imagesUrls}
                                    />
                                </Col>
                            </Row>
                        </div>
                }


            </div>
        );
    }
}

export default withRouter(goodsDetails);