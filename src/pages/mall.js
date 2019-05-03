import React from 'react';
import { Row, Col, Pagination, Divider, Tag } from 'antd';
import { connect } from 'dva';
import GoodsCard from '../components/GoodsCard';
import { withRouter } from 'react-router-dom';

const CheckableTag = Tag.CheckableTag;

const namespace = 'goodsList';

const mapStateToProps = (state) => {
    const goodsList = state[namespace].list;
    const category = state[namespace].category;
    // console.log(goodsList)
    // console.log(category)
    return {
        goodsList,
        category,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: (goodsListQO) => {
            const action = {
                type: `${namespace}/getGoodsList`,
                payload: goodsListQO,
            };
            dispatch(action);
        },
        onDidMountGetCategory: () => {
            const action = {
                type: `${namespace}/getCategory`,
            };
            dispatch(action);
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class mall extends React.Component {

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    };

    componentDidMount() {
        this.props.onDidMountGetCategory();
    }

    static GetUrlByParamName(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let URL = decodeURI(window.location.search);
        let r = URL.substr(1).match(reg);
        if (r != null) {
            //decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码
            return decodeURI(r[2]);
        }
        return null;
    };


    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 12,
            selectedTags: [],
            category: 0,
            keyword: mall.GetUrlByParamName('keyword'),
        };
        this.getList();
    }

    getList() {
        let goodsListQO = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            category: this.state.category,
            keyword: this.state.keyword,
        };
        console.log('----goodsListQO----');
        console.log(goodsListQO);
        this.props.onDidMount(goodsListQO);
    }

    handleChange(tag, checked) {
        const nextSelectedTags = checked ? [tag] : [];
        this.setState({
            selectedTags: nextSelectedTags,
            category: checked ? tag : 0,
        }, () => {
            this.getList();
        });
    }

    //页码改变方法
    onChange = (pageNum) => {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.getList();
        });
    };

    render() {
        const { selectedTags } = this.state;

        return (
            <div>
                <Row gutter={4} style={{ textAlign: 'center' }}>
                    <Col span={2}><h3>分类</h3></Col>
                    <Col span={1}><Divider type="vertical"/></Col>
                    <Col span={2} key={0 + '全部'}>
                        <CheckableTag
                            key={0}
                            checked={selectedTags.indexOf(0) > -1}
                            onChange={checked => this.handleChange(0, checked)}
                        >
                            <font size={1.5}>全部</font>
                        </CheckableTag>
                    </Col>
                    {
                        this.props.category.map(c => {
                            return (
                                <Col span={2} key={c.id + c.categoryName}>
                                    <CheckableTag
                                        key={c.id}
                                        checked={selectedTags.indexOf(c.id) > -1}
                                        onChange={checked => this.handleChange(c.id, checked)}
                                    >
                                        <font size={1.5}>{c.categoryName}</font>
                                    </CheckableTag>
                                </Col>
                            );
                        })
                    }
                </Row>
                <hr/>
                <Row style={{ paddingTop: 30 }}>
                    {
                        this.props.goodsList.list === undefined ? null :
                            this.props.goodsList.list.map(goods => {
                                return (
                                    <Col span={6} align='middle' style={{ paddingBottom: 30 }} key={goods.id}>
                                        <GoodsCard
                                            imgSrc={goods.mainImageUrl}
                                            id={goods.id}
                                            price={goods.price}
                                            quantity={goods.quantity}
                                            title={goods.goodsName}
                                        />
                                    </Col>
                                );
                            })
                    }
                </Row>
                <div style={{ float: 'right' }}>
                    <Pagination
                        hideOnSinglePage={true}
                        pageSize={this.state.pageSize}
                        defaultCurrent={1}
                        total={this.props.goodsList.total}
                        onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}


export default withRouter(mall);
