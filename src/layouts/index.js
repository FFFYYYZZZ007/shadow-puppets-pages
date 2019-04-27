import { Layout, Menu, Input, Row, Col, Divider, Icon, Button } from 'antd';
import Link from 'umi/link';
import MyIcon from '../components/MyIcon';
import { getCookie, delCookie } from '../util/cookie.js';
import router from 'umi/router';
import React from 'react';
import { connect } from 'dva';

// 引入子菜单组件
const SubMenu = Menu.SubMenu;
// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;
const Search = Input.Search;


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



function BasicLayout(props) {
    // let collapsed = false;
    // function toggle() {
    //     console.log(1);
    //     collapsed = !collapsed;
    //     console.log(collapsed);
    // }
    if (props.location.pathname.match('/manager')) {
        return <Layout>
            <Sider style={{ minHeight: '100vh', background: '#e6f7ff' }}
                   theme='light'
                   // collapsible
                   // collapsed={collapsed}
            >
                {/*<div*/}
                {/*    style={{ height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px', textAlign: 'center' }}>*/}
                {/*    <h1>皮影戏服务管理系统</h1>*/}
                {/*</div>*/}
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
                        <Menu.Item key="5"><Link to='/manager/orderManager'>订单管理</Link></Menu.Item>
                        <Menu.Item key="6"><Link to='/manager/express'>物流管理</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>
                    {/*<Icon*/}
                    {/*    className="trigger"*/}
                    {/*    type={collapsed ? 'menu-unfold' : 'menu-fold'}*/}
                    {/*    onClick={()=>toggle()}*/}
                    {/*/>*/}
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
                        {props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>PYC ©2019 Created by fuyuaaa</Footer>
            </Layout>
        </Layout>;
    }

    return (
        <Layout style={{ background: '#fff' }}>
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
                        <MyIcon type="read" name="培训"/>
                    </Menu.Item>
                    <Menu.Item>
                        <Search
                            placeholder="请输入搜索内容"
                            onSearch={value => console.log(value)}
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
                            <Menu.Item>
                                <Link to="/order"><Icon type="ordered-list"/></Link>
                            </Menu.Item>
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
                    style={{ paddingTop: 25, paddingLeft: 100, paddingRight: 100, background: '#fff', minHeight: 400 }}>
                    {props.children}
                </div>
            </Content>
            <Divider/>
            <Footer style={{ background: '#ffffff' }}>
                <div style={{ background: '#ffffff' }}>

                    <Row>
                        <Col span={12} align='middle'>
                            <div style={{ fontSize: 50 }}>
                                欢迎与我们一起<br/>
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
    );
}

export default BasicLayout;
