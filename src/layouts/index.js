import { Layout, Menu, Input, Row, Col, Divider, Icon } from 'antd';
import Link from 'umi/link';
import MyIcon from '../components/MyIcon';
import { getCookie, delCookie } from '../util/cookie.js';
import router from 'umi/router';
import React from 'react';

// 引入子菜单组件
const SubMenu = Menu.SubMenu;
// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;
const Search = Input.Search;
const MenuItemGroup = Menu.ItemGroup;

function logout() {
    delCookie('userName');
    delCookie('ACCESS_TOKEN');
    delCookie('admin');
}

function getCookieLocal() {
    let userInfo = getCookie('userName');
    if (userInfo === '') {
        router.push('/error/403');
    }
    return userInfo;
}

class BasicLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            keyword: '',
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        console.log(this.state.collapsed);
    };

    searchGoods(value) {
        console.log(value);
        if (window.location.href.match('mall')) {
            window.location.href = '/mall?keyword=' + value;
            return;
        }
        router.replace({
            pathname: '/mall',
            query: {
                keyword: value,
            },
        });
    }

    searchKeywordChange = (e) => {
        this.setState({
            keyword: e.target.value,
        });
    };

    render() {
        if (this.props.location.pathname.match('/manager')) {
            return <Layout>
                <Sider style={{ minHeight: '100vh', background: '#e6f7ff' }}
                       theme='light'
                       collapsible
                       collapsed={this.state.collapsed}
                >
                    <div
                        style={{
                            height: '32px',
                            background: 'rgba(255,255,255,.2)',
                            margin: '16px',
                            textAlign: 'center',
                        }}>
                        <h1>{this.state.collapsed ? '皮影' : '皮影戏服务管理系统'}</h1>
                    </div>
                    <Menu theme="light" mode="inline"
                          defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Icon type="pie-chart"/>
                            <span>数据分析</span>
                            <Link to='/manager/dataAnalysis'/>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="dashboard"/><span>数据管理</span></span>}
                        >
                            <Menu.Item key="2"><Link to='/manager/userManager'>用户管理</Link></Menu.Item>
                            <Menu.Item key="3"><Link to='/manager/goodsManager'>商品管理</Link></Menu.Item>
                            <Menu.Item key="4"><Link to='/manager/categoryManager'>类别管理</Link></Menu.Item>
                            <Menu.Item key="5"><Link to='/manager/courseOrderManager'>课程订单</Link></Menu.Item>
                            <Menu.Item key="6"><Link to='/manager/orderManager'>商品订单</Link></Menu.Item>
                            <Menu.Item key="7"><Link to='/manager/express'>物流管理</Link></Menu.Item>
                            <Menu.Item key="8"><Link to='/manager/courseManager'>课程管理</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>

                        <Icon
                            style={{ paddingLeft: 30 }}
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <Menu mode="horizontal" style={{ float: 'right' }}>
                            <Menu.Item key="userInfo">
                                <Link to="/userInfo">{getCookieLocal()}</Link>
                            </Menu.Item>
                            <Menu.Item key="logout">
                                <Link to='/login' onClick={logout}>退出登录</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>PYC ©2019 Created by fuyuaaa</Footer>
                </Layout>
            </Layout>;
        }

        return (
            <Layout style={{
                background: '#fff',
            }}>
                <Header style={{ background: '#fff', textAlign: 'right', padding: 0 }}>
                    <Menu mode="horizontal">
                        <Menu.Item key="x">
                            <Link to="/">
                                <div style={{ fontSize: 20 }}>
                                    皮影戏服务平台
                                </div>
                            </Link>
                        </Menu.Item>
                        <Menu.Item style={{ paddingLeft: 150 }}/>
                        <Menu.Item key="home">
                            <Link to="/"><MyIcon type="home" name="首页"/></Link>
                        </Menu.Item>
                        <Menu.Item key="shop">
                            <Link to="/mall"><MyIcon type="shopping" name="商城"/></Link>
                        </Menu.Item>
                        <Menu.Item key="study">
                            <Link to="/course"><MyIcon type="read" name="培训"/></Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Search
                                placeholder="请输入搜索内容"
                                defaultValue={this.state.keyword}
                                onChange={this.searchKeywordChange}
                                onSearch={value => this.searchGoods(value)}
                                style={{ width: 200 }}
                            />
                        </Menu.Item>
                        <Menu.Item style={{ paddingLeft: 50 }}/>
                        {
                            getCookie('ACCESS_TOKEN') !== undefined && getCookie('ACCESS_TOKEN') !== '' ?
                                <Menu.Item key="userInfo">
                                    <Link to="/userInfo">{getCookie('userName')}</Link>
                                </Menu.Item>
                                :
                                <Menu.Item key="login">
                                    <Link to="/login">登录</Link>
                                </Menu.Item>
                        }
                        {
                            getCookie('ACCESS_TOKEN') !== undefined && getCookie('ACCESS_TOKEN') !== '' ?
                                <Menu.Item key="logout">
                                    <Link to='/login' onClick={logout}>退出登录</Link>
                                </Menu.Item>
                                :
                                <Menu.Item key="register">
                                    <Link to="/register">注册</Link>
                                </Menu.Item>
                        }
                        {
                            getCookie('ACCESS_TOKEN') !== undefined && getCookie('ACCESS_TOKEN') !== '' ?
                                <Menu.Item>
                                    <Link to="/shoppingCart"><Icon type="shopping-cart"/></Link>
                                </Menu.Item>
                                :
                                null
                        }
                        {
                            getCookie('ACCESS_TOKEN') !== undefined && getCookie('ACCESS_TOKEN') !== '' ?
                                <SubMenu
                                    title={<span className="submenu-title-wrapper"><Icon type="ordered-list"/></span>}>
                                    <MenuItemGroup title="订单">
                                        <Menu.Item key="order:1"><Link to="/order">商品订单</Link></Menu.Item>
                                        <Menu.Item key="order:2"><Link to="/courseOrder">课程订单</Link></Menu.Item>
                                    </MenuItemGroup>
                                </SubMenu>
                                :
                                null
                        }

                        {
                            getCookie('admin') !== undefined && getCookie('admin') === 'true' ?
                                <Menu.Item>
                                    <Link to="/manager/dataAnalysis"><Icon type="table"/></Link>
                                </Menu.Item>
                                :
                                null
                        }

                    </Menu>
                </Header>
                <Content>
                    <div
                        style={{
                            paddingTop: 25,
                            paddingLeft: 100,
                            paddingRight: 100,
                            background: '#fff',
                            minHeight: 400,

                        }}>
                        {this.props.children}
                    </div>

                </Content>
                <Divider/>
                <Footer style={{ background: '#ffffff' }}>
                    <div style={{ background: '#ffffff' }}>
                        <Row>
                            <Col span={12} align='middle'>
                                <center style={{ fontSize: 20, fontFamily: '开楷体' }}>
                                    欢迎与我们一起，传承皮影戏文化
                                </center>
                            </Col>
                            <Col span={12}>
                                <center>
                                    电话：159 6712 1280<br/>
                                    地址：浙江工商大学
                                </center>
                            </Col>
                        </Row>
                    </div>
                </Footer>
            </Layout>
        );
    }


}

export default BasicLayout;
