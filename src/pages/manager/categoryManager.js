import React from 'react'
import {
    Table, Input, InputNumber, Popconfirm, Form, Button, message, Card, Row, Modal
} from 'antd';
import { getCategory, addCategory, updateCategory, removeCategory } from '../../services/GoodsService'
const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    }

    getInput = () => {
        if (this.props.inputType === 'number') { return <InputNumber />; }
        return <Input />;
    };
    render() {
        const {
            editing, dataIndex, title, inputType, record, index, ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
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

class CategoryManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            loading: false,
            visible: false,
            addInput: ''
        };
        this.columns = [
            { title: '类别ID', dataIndex: 'id', width: '25%', },
            { title: '类别名', dataIndex: 'categoryName', width: '25%', editable: true, },
            { title: '更新时间', dataIndex: 'dateUpdate', width: '25%', },
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
                                        <Button type='primary' disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>编辑</Button>&nbsp;&nbsp;
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
    }

    componentDidMount() { this.changeCategory() }

    changeCategory() {
        this.setState({
            loading: true
        })
        getCategory().then((result) => {
            this.changeLoading();
            let data = [];
            result.data.map((c) => {
                data.push({
                    key: c.id,
                    id: c.id,
                    categoryName: c.categoryName,
                    dateUpdate: c.dateUpdate,
                });
                return null;
            })
            this.setState({
                data: data,
            })
            console.log(result)
        })
    }
    isEditing = record => record.key === this.state.editingKey;
    cancel = () => { this.setState({ editingKey: '' }); };

    delete = (key) => {
        this.changeLoading()
        removeCategory(key).then((result) => {
            if (result.code === '200') {
                message.success(result.msg);
                this.changeCategory()
            } else {
                message.error(result.msg)
                this.changeCategory()
            }
        })
    }

    changeLoading() { this.setState({ loading: this.state.loading ? false : true }) }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            this.onUpdateCategory({ ...row, id: key });
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
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

    onUpdateCategory(category) {
        category = {
            id: category.id,
            categoryName: category.categoryName
        }
        this.setState({
            loading: true
        })
        updateCategory(category).then((result) => {
            if (result.code === '200') {
                message.success(result.msg);
            } else {
                message.error(result.msg)
            }
            this.setState({
                loading: false
            })
        })
    }

    edit(key) { this.setState({ editingKey: key }); }
    showModal = () => { this.setState({ visible: true, }); }
    handleCancel = (e) => { console.log(e); this.setState({ visible: false, }); }
    addInputChange(e) { this.setState({ addInput: e.target.value }) }
    handleOk = (e) => {
        this.changeLoading();
        addCategory({ categoryName: this.state.addInput }).then((result) => {
            this.changeLoading();
            if (result.success === true) {
                message.success(result.msg);
                this.changeCategory()
            } else { message.error(result.msg); }
        });
        this.setState({ visible: false, });
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
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <React.Fragment>
                <div style={{ background: '#fff' }}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-around" align="middle">
                            <font size={3}>类别管理</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}></div>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>
                        <div style={{ paddingBottom: 20 }}>
                            <Button type="primary" onClick={this.showModal}>
                                添加类别
                            </Button>
                            <Modal
                                title="请输入需要添加的类别名"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <Input style={{ width: 200 }} onChange={(e) => this.addInputChange(e)}></Input>
                            </Modal>
                        </div>
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                loading={this.state.loading}
                                components={components}
                                bordered
                                dataSource={this.state.data}
                                columns={columns}
                            />
                        </EditableContext.Provider>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const CategoryManagerEditableFormTable = Form.create()(CategoryManager);

export default CategoryManagerEditableFormTable;