import React from 'react';
import { Tabs, Icon } from 'antd';
import GoodList from './GoodList'
const TabPane = Tabs.TabPane;

class GoodMenu extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="2" style={{ paddingTop: 30 }}>
                    <TabPane tab={<span><Icon type="shopping" />推荐商品</span>} key="1">
                        <GoodList/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="shopping" />热卖商品</span>} key="2">
                    <GoodList/>
                    </TabPane>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default GoodMenu;