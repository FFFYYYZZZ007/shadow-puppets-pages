import React from 'react';
import { Tabs, Icon } from 'antd';
import CourseList from './CourseList'

const TabPane = Tabs.TabPane;
class CourseMenu extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="2" style={{ paddingTop: 30 }}>
                    <TabPane tab={<span><Icon type="read" />推荐商品</span>} key="1">
                        <CourseList />
                    </TabPane>
                    <TabPane tab={<span><Icon type="read" />热卖商品</span>} key="2">
                        <CourseList />
                    </TabPane>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default CourseMenu;