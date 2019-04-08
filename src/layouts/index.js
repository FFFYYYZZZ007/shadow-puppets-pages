import { Layout, Menu, Input, Row, Col, Divider } from 'antd';
import Link from 'umi/link';
import MyIcon from '../components/MyIcon';

// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Content } = Layout;
const Search = Input.Search;

function BasicLayout(props) {
    return (
        <Layout style={{ background: '#fff' }} >
            <Header style={{ background: '#fff', textAlign: 'right', padding: 0 }}>
                <Menu mode="horizontal" >
                    <Menu.Item key="x" >
                        <Link to="/">
                            <div style={{ fontSize: 20 }}>
                                皮影戏服务平台
                            </div>
                        </Link>
                    </Menu.Item>
                    <Menu.Item style={{ paddingLeft: 150 }} />
                    <Menu.Item key="home">
                        <Link to="/"><MyIcon type="home" name="首页" /></Link>
                    </Menu.Item>
                    <Menu.Item key="shop">
                        <Link to="/mall"><MyIcon type="shopping" name="商城" /></Link>
                    </Menu.Item>
                    <Menu.Item key="study">
                        <MyIcon type="read" name="培训" />
                    </Menu.Item>
                    <Menu.Item>
                        <Search
                            placeholder="请输入搜索内容"
                            onSearch={value => console.log(value)}
                            style={{ width: 200 }}
                        />
                    </Menu.Item>
                    <Menu.Item style={{ paddingLeft: 50 }} />
                    <Menu.Item key="login">
                        <Link to="/login">登录</Link>
                    </Menu.Item>
                    <Menu.Item key="register">
                        <Link to="/register">注册</Link>
                    </Menu.Item>
                    <Menu.Item style={{ paddingLeft: 50 }} />
                </Menu>
            </Header>
            <Content >
                <div style={{ paddingTop: 25, paddingLeft: 100, paddingRight: 100, background: '#fff', minHeight: 400 }}>
                    {props.children}
                </div>
            </Content>
            <Divider />
            <Footer style={{ background: '#ffffff' }}>
                <div style={{ background: '#ffffff' }}>

                    <Row>
                        <Col span={12} align='middle'>
                            <div style={{ fontSize: 50 }}>
                                欢迎与我们一起<br />
                                传承皮影戏文化
                            </div>

                        </Col>
                        <Col span={6}>
                            <Col>用户帮助</Col>
                            <Col>帮助手册</Col>
                            <Col>反馈</Col>
                        </Col>
                        <Col span={6}>
                            <Col>联系我们</Col>
                            <Col>电话：159 6712 1280</Col>
                            <Col>地址：浙江工商大学</Col>
                        </Col>
                    </Row>
                </div>
            </Footer>
        </Layout>
    )
}

export default BasicLayout;
