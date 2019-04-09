import React from 'react';
import { Tabs, Icon } from 'antd';
import GoodsList from './GoodsList';
import router from 'umi/router';
const TabPane = Tabs.TabPane;

class GoodsMenu extends React.Component {
    onChange=(key)=>{
        if(key === 'x'){
            router.push("/mall");
        }
    }
    render() {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="1" style={{ paddingTop: 30 }} onChange={this.onChange}>
                    <TabPane tab={<span><Icon type="shopping" />推荐商品</span>} key="1">
                        <GoodsList />
                    </TabPane>
                    <TabPane tab={<span><Icon type="shopping" />热卖商品</span>} key="2">
                        <GoodsList />
                    </TabPane>
                    <TabPane tab={<span ><Icon type="more" />更多</span>} key="x">
                    </TabPane>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default GoodsMenu;