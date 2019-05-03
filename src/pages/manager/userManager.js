import React from 'react';
import {
    Table,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Button,
    message,
    Card,
    Select,
    Row,
    Col,
    Progress,
    DatePicker,
} from 'antd';
import { getUserManagerList, updateUser, deleteUser, getHeader } from '../../services/UserService';
import ChartCard from 'ant-design-pro/lib/Charts/ChartCard';
import Field from 'ant-design-pro/lib/Charts/Field';
import * as numeral from 'numeral';
import { userDateAnalysis } from '@/services/Analysis';
import TagCloud from 'ant-design-pro/lib/Charts/TagCloud';
import moment from 'moment';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const { Option } = Select;

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber/>;
        }
        if (this.props.inputType === 'sexRadio') {
            console.log(this.props.value);
            return <Select initialValue={this.props.record.sex}>
                <Option value={'男'} key={1}>男</Option>
                <Option value={'女'} key={0}>女</Option>
            </Select>;
        }
        if (this.props.inputType === 'birthday') {
            console.log(this.props.record.birthday);

            return <DatePicker />
        }
        return <Input/>;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                inputType === 'birthday' ?
                                    <FormItem style={{ margin: 0 }}>
                                        {getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `请输入 ${title}!`,
                                            }],
                                            initialValue: moment(record[dataIndex]),
                                        })(this.getInput())}
                                    </FormItem>
                                    :
                                    <FormItem style={{ margin: 0 }}>
                                        {getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `请输入 ${title}!`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(this.getInput())}
                                    </FormItem>

                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class UserManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            keyword: '',
            tel: '',
            sex: -1,
            pagination: {
                current: 1,
                pageSize: 8,
                total: 0,
            },
            loading: false,

            userCountData: {
                countUser: 0,
                countOnlineWeek: 0,
                onlinePercent: 0,
            },

            userManagerHeader: {
                newUserMonth: 0,
                newUserWeek: 0,
                userTagList: [],
                boysPercent: 0,
                girlsPercent: 0,
            },
        };
        this.columns = [
            { title: '用户名', dataIndex: 'userName', width: '20%' },
            { title: '性别', dataIndex: 'sex', width: '15%', editable: true, inputType: 'sexRadio' },
            { title: '出生日期', dataIndex: 'birthday', width: '20%', editable: true, inputType: 'birthday' },
            { title: '手机号码', dataIndex: 'tel', width: '20%' },

            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Button
                                                type='primary'
                                                onClick={() => this.save(form, record.key)}
                                                style={{ marginRight: 8 }}>保存</Button>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确认取消?"
                                        onConfirm={() => this.cancel(record.key)}>
                                        <Button type='danger'>取消</Button>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                        <Button type='primary' disabled={editingKey !== ''}
                                                onClick={() => this.edit(record.key)}>编辑</Button>&nbsp;&nbsp;
                                    <Popconfirm
                                        title="此操作不可逆，确认删除?"
                                        onConfirm={() => this.delete(record.key)}>
                                            <Button type='danger'>删除</Button>
                                        </Popconfirm>
                                    </span>
                            )}
                        </div>
                    );
                },
            },
        ];
        this.getUserCountData();
        this.getUserManagerHeader();
    }

    componentDidMount() {
        this.changeUserManagerList();
    }

    changeUserManagerList() {
        let userListQO = {
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            keyword: this.state.keyword,
            tel: this.state.tel,
            sex: this.state.sex,
        };
        console.log(userListQO);
        this.setState({
            loading: true,
        });
        getUserManagerList(userListQO).then((result) => {
            this.changeLoading();
            let data = [];
            result.data.list.map((user) => {
                data.push({
                    key: user.id,
                    userName: user.userName,
                    sex: user.sex,
                    birthday: user.birthday,
                    tel: user.tel,
                });
                return null;
            });
            this.setState({
                data: data,
                pagination: {
                    current: result.data.pageNum,
                    pageSize: result.data.pageSize,
                    total: result.data.total,
                },
            });
            console.log(result);
        });
    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    delete = (key) => {
        this.changeLoading();
        deleteUser(key).then((result) => {
            if (result.code === '200') {
                message.success(result.msg);
                this.changeUserManagerList();
            } else {
                message.error(result.msg);
                this.changeLoading();
            }
        });
    };

    changeLoading() {
        this.setState({
            loading: !this.state.loading,
        });
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            this.onUpdateUser({ ...row, id: key });
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                let item = newData[index];
                row = {
                    ...row,birthday:row.birthday.format('YYYY-MM-DD')
                };
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    onUpdateUser(user) {
        this.setState({
            loading: true,
        });
        user = {
            ...user,birthday:user.birthday.format('YYYY-MM-DD')
        };
        console.log(user)
        updateUser(user).then((result) => {
            if (result.code === '200') {
                message.success(result.msg);
            } else {
                message.error(result.msg);
            }
            this.setState({
                loading: false,
            });
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    pageChange(pageNum) {
        const pageInfo = { ...this.state.pagination };
        pageInfo.current = pageNum;
        this.setState({
            pagination: pageInfo,
        }, () => {
            this.changeUserManagerList();
        });
    }

    keywordChange(e) {
        this.setState({ keyword: e.target.value });
    };

    telChange(e) {
        this.setState({ tel: e.target.value });
    }

    sexChange(sex) {
        this.setState({ sex: sex });
    }


    getUserCountData() {
        userDateAnalysis().then((result) => {
            this.setState({
                userCountData: result.data,
            });
        });
    };

    getUserManagerHeader() {
        getHeader().then((result) => {
            this.setState({
                userManagerHeader: result.data,
            });
        });
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        const paginationProps = {
            ...this.state.pagination,
            onChange: (current) => this.pageChange(current),
        };
        return (
            <React.Fragment>
                <Row gutter={40}>
                    <Col span={6}>
                        <ChartCard
                            title="用户总量"
                            total={() => <span
                                dangerouslySetInnerHTML={{ __html: (this.state.userCountData.countUser) }}/>}
                            footer={<Field label="周在线人数"
                                           value={numeral(this.state.userCountData.countOnlineWeek).format('0,0')}/>}
                            contentHeight={37}
                        >
                            周在线比例: {this.state.userCountData.onlinePercent + '%'}
                        </ChartCard>
                    </Col>
                    <Col span={6}>
                        <ChartCard
                            title="用户比例"
                            style={{ textAlign: 'center' }}
                            footer={<Field
                                value={'男：' + this.state.userManagerHeader.boysPercent + '%，女' + this.state.userManagerHeader.girlsPercent + '%'}/>}
                        >
                            <Progress type="circle" percent={this.state.userManagerHeader.boysPercent} width={80}/>
                        </ChartCard>
                    </Col>
                    <Col span={6}>
                        <ChartCard
                            title="本月新用户"
                            total={() => <span
                                dangerouslySetInnerHTML={{ __html: (this.state.userManagerHeader.newUserMonth) }}/>}
                            footer={<Field value={'-_-'}/>}
                            contentHeight={37}
                        >
                            本周新用户：{this.state.userManagerHeader.newUserWeek}
                        </ChartCard>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <TagCloud data={this.state.userManagerHeader.userTagList} height={125}/>
                        </Card>
                    </Col>
                </Row>

                <div style={{ height: 30 }}/>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>
                        <div style={{ paddingBottom: 24 }}>
                            <Input style={{ width: 200 }} placeholder="请输入用户名" onChange={e => this.keywordChange(e)}
                                   allowClear/>&nbsp;&nbsp;&nbsp;
                            <Input style={{ width: 200 }} placeholder="请输入手机号" onChange={e => this.telChange(e)}
                                   allowClear/>&nbsp;&nbsp;&nbsp;
                            <Select style={{ width: 200 }} placeholder='请选择性别' allowClear
                                    onChange={e => this.sexChange(e)}>
                                <Option value="1">男</Option>
                                <Option value="0">女</Option>
                            </Select>&nbsp;&nbsp;&nbsp;
                            <Button type='primary' onClick={() => this.changeUserManagerList()}>搜索</Button>
                        </div>
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                loading={this.state.loading}
                                components={components}
                                bordered
                                dataSource={this.state.data}
                                pagination={paginationProps}
                                columns={columns}
                            />
                        </EditableContext.Provider>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const UserManagerEditableFormTable = Form.create()(UserManager);

export default UserManagerEditableFormTable;
