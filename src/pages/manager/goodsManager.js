import React from 'react';
import {
    Table, Input, InputNumber, Popconfirm, Form, Button, message, Card, Row, Modal, Select, Icon, Upload,
} from 'antd';
import { getManagerList, getCategory, updateGoods, removeGoods, addGoods, categoryStatisticsInfo } from '../../services/GoodsService';
import PicturesWall from '../../components/picturesWall';
import 'ant-design-pro/dist/ant-design-pro.css';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const { TextArea } = Input;
const { Option } = Select;

function CustomExpandIcon(props) {
    let text;
    if (props.expanded) {
        text = "minus-circle";
    } else {
        text = "plus-circle";
    }
    return (
        <Icon type={text} theme="twoTone" onClick={e => props.onExpand(props.record, e)} />
    );
}
const categoryList = [];
const categoryStatisticsInfoList = [];
class EditableCell extends React.Component {

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    }
    
    getInput = () => {
        if (this.props.inputType === 'number') { return <InputNumber />; }
        if (this.props.inputType === 'double') { return <InputNumber precision={2} /> }
        if (this.props.inputType === 'bigText') { return <TextArea style={{ height: 100 }} /> }
        if (this.props.inputType === 'saleStatus') {
            return <Select initialValue={this.props.value}>
                <Option value="在售">在售</Option>
                <Option value="未上架">未上架</Option>
            </Select>
        }
        if (this.props.inputType === 'category') {
            return <Select initialValue={this.props.value}>
                {categoryList.map(function (data) {
                    return <Option value={data.categoryName} key={data.id}>{data.categoryName}</Option>;
                })}
            </Select>
        }
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

class GoodsManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            loading: false,
            visible: false,
            pagination: {
                current: 1,
                pageSize: 4,
                total: 0
            },
            newGoods: {},
            goodsListQO: {},
        };
        this.columns = [
            { title: '商品ID', dataIndex: 'id', width: '8%', },
            { title: '商品名', dataIndex: 'goodsName', width: '20%', editable: true, inputType: 'bigText' },
            { title: '类别名', dataIndex: 'categoryName', width: '8.5%', editable: true, inputType: 'category' },
            { title: '主图', dataIndex: 'mainImageUrl', width: '10%', render: text => <img style={{ height: 100, wdith: 170 }} alt='' src={text} /> },
            { title: '价格/元', dataIndex: 'price', width: '8.5%', editable: true, inputType: 'double' },
            { title: '是否在售', dataIndex: 'onSale', width: '9%', editable: true, inputType: 'saleStatus', },
            { title: '库存数量', dataIndex: 'quantity', width: '9%', editable: true, inputType: 'number' },
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

    componentDidMount() {
        this.changeGoodsList();
        this.getCategoryList();
        this.getCategoryStatisticsInfo();
    }

    getCategoryStatisticsInfo = () => {
        categoryList.length = 0;
        categoryStatisticsInfo().then((result) => {
            console.log(result)
            let map = result.data;
            for (var key in map) {
                categoryStatisticsInfoList.push({ x: key, y: map[key] })
            }
            console.log(categoryStatisticsInfoList)
        })
    }

    getCategoryList = () => {
        categoryList.length = 0;
        getCategory().then((result) => {
            result.data.map(category => {
                categoryList.push({
                    id: category.id,
                    categoryName: category.categoryName
                });
                return null;
            })
            console.log(categoryList);
        });
    }

    keywordChange = (e) => { this.setState({ goodsListQO: { ...this.state.goodsListQO, keyword: e.target.value } }) }
    qoCategoryChange = (value) => { this.setState({ goodsListQO: { ...this.state.goodsListQO, category: value } }) }
    qoSaleStatusChange = (value) => { this.setState({ goodsListQO: { ...this.state.goodsListQO, onSale: value } }) }


    changeGoodsList() {
        this.setState({
            loading: true
        })
        let GoodsListQO = {
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            keyword: this.state.goodsListQO.keyword,
            category: this.state.goodsListQO.category,
            onSale: this.state.goodsListQO.onSale,
        }
        console.log(GoodsListQO);
        getManagerList(GoodsListQO).then((result) => {
            if(result.success === false){
                message.error(result.msg);
                this.changeLoading();
                return;
            }
            let data = [];
            result.data.list.map((goods) => {
                data.push({
                    key: goods.id,
                    id: goods.id,
                    goodsName: goods.goodsName,
                    categoryName: goods.categoryName,
                    mainImageUrl: goods.mainImageUrl,
                    price: goods.price,
                    onSale: goods.onSale,
                    quantity: goods.quantity,
                    imagesUrls: goods.imagesUrls,
                });
                return null;
            })
            this.setState({
                loading: false,
                data: data,
                pagination: {
                    current: result.data.pageNum,
                    pageSize: result.data.pageSize,
                    total: result.data.total,
                }
            })
            console.log(result)
        })
    }
    isEditing = record => record.key === this.state.editingKey;
    cancel = () => { this.setState({ editingKey: '' }); };

    //删除商品，软删除，数据库里能查到
    delete = (key) => {
        this.changeLoading()
        removeGoods(key).then((result) => {
            if (result.code === '200') {
                message.success(result.msg);
                this.changeGoodsList()
            } else {
                message.error(result.msg)
                this.changeGoodsList()
            }
        })
    }

    changeLoading() { this.setState({ loading: this.state.loading ? false : true }) }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            console.log(row)
            this.partUpdateGoods({ ...row, id: key });
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

    partUpdateGoods(goodsBO) {
        goodsBO = {
            id: goodsBO.id,
            goodsName: goodsBO.goodsName,
            categoryId: categoryList.find(function (x) { return x.categoryName === goodsBO.categoryName; }).id,
            price: goodsBO.price,
            quantity: goodsBO.quantity,
            onSale: goodsBO.onSale === "在售" ? 1 : 0,
        }
        console.log(goodsBO);
        this.changeLoading();
        updateGoods(goodsBO).then((result) => {
            if (result.code === '200') {
                message.success(result.msg);
            } else {
                message.error(result.msg);
                this.changeGoodsList();
            }
            this.changeLoading();
        })
    }
    edit(key) { this.setState({ editingKey: key }); }

    //下面这三个方法是添加商品modal的操作
    showModal = () => { this.setState({ visible: true, }); }
    handleCancel = (e) => { console.log(e); this.setState({ visible: false, newGoods: {} }); }
    handleOk = (e) => {
        this.setState({ visible: false, });
        console.log(this.state.newGoods)
        addGoods(this.state.newGoods).then((result) => {
            console.log(result);
            if (result.success) {
                message.success(result.msg);
                this.changeGoodsList();
            } else { message.error(result.msg) };
            this.setState({ newGoods: {} })
        })
    }
    clearNewGoods = () => { this.setState({ newGoods: {} }) }

    //add开头的方法都是添加商品modal中对应的值改变方法(由于是菜鸡不会在form里用upload, 所以这样乱搞了很多方法, 我淦)
    addGoodsNames = (e) => { this.setState({ newGoods: { ...this.state.newGoods, goodsName: e.target.value } }) }
    addGoodsCategory = (value) => { this.setState({ newGoods: { ...this.state.newGoods, categoryId: value } }) }
    addGoodsIntroduction = (e) => { this.setState({ newGoods: { ...this.state.newGoods, introduction: e.target.value } }) }
    addGoodsPrice = (value) => { this.setState({ newGoods: { ...this.state.newGoods, price: value } }) }
    addGoodsSaleStatus = (value) => { this.setState({ newGoods: { ...this.state.newGoods, onSale: value } }) }
    addGoodsQuantity = (value) => { console.log(value); this.setState({ newGoods: { ...this.state.newGoods, quantity: value } }) }
    //添加商品modal的主图uoload
    addGoodsMainImageUrl = (info) => {
        console.log('file')
        console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                loading: false,
                newGoods: {
                    ...this.state.newGoods, mainImageUrl: info.file.response.data
                }
            });
            return;
        }
    }

    //页码改变方法
    pageChange(pageNum) {
        const pageInfo = { ...this.state.pagination }
        pageInfo.current = pageNum;
        this.setState({ pagination: pageInfo }, () => { this.changeGoodsList() })
    }

    render() {
        const components = { body: { cell: EditableCell, }, };

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

        //页码改变触发方法
        const paginationProps = {
            ...this.state.pagination,
            onChange: (current) => this.pageChange(current),
        };

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );



        return (
            <React.Fragment>
                <div style={{ background: '#fff' }}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-around" align="middle">
                            <font size={3}>商品管理</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}></div>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>
                        <div style={{ paddingBottom: 20 }}>
                            <Button type="primary" onClick={this.showModal}>
                                添加商品
                            </Button>
                            <Modal
                                title="请输入需要商品信息"
                                okText='添加'
                                cancelText='取消'
                                destroyOnClose
                                closable={false}
                                visible={this.state.visible}
                                footer={[
                                    <Popconfirm
                                        key={'canclePop'}
                                        cancelText='那我再想想'
                                        okText='我确定了'
                                        title="确认取消？内容可不会保存噢，你可在想想！"
                                        onConfirm={this.handleCancel}>
                                        <Button type='danger'>取消</Button>
                                    </Popconfirm>,
                                    <Popconfirm
                                        key={'okPop'}
                                        cancelText='不太确定'
                                        okText='确定'
                                        title="确认添加？"
                                        onConfirm={this.handleOk}>
                                        <Button type='primary'>添加</Button>
                                    </Popconfirm>,
                                ]}
                            >
                                {/* 由于还要使用上传图片的组件，所以这里用form的话，我这个菜鸡就不会了 */}
                                <label>商品名称：</label><Input style={{ width: 200 }} onChange={this.addGoodsNames} /><br /><br />
                                <label>商品类别：</label>
                                <Select style={{ width: 200 }} onChange={this.addGoodsCategory}>
                                    {categoryList.map(function (data) {
                                        return <Option value={data.id} key={data.id}>{data.categoryName}</Option>;
                                    })}
                                </Select><br /><br />
                                <label>商品简介：</label><TextArea style={{ width: 400, height: 100 }} onChange={this.addGoodsIntroduction}></TextArea><br /><br />
                                <label>商品价格：</label><InputNumber style={{ width: 200 }} precision={2} onChange={this.addGoodsPrice}></InputNumber><br /><br />
                                <label>商品状态：</label>
                                <Select style={{ width: 200 }} onChange={this.addGoodsSaleStatus}>
                                    <Option value="1" key={1}>在售</Option>
                                    <Option value="0" key={0}>未上架</Option>
                                </Select><br /><br />
                                <label>库存数量：</label><InputNumber style={{ width: 200 }} onChange={this.addGoodsQuantity}></InputNumber><br /><br />
                                <label>商品主图：</label>
                                <Upload
                                    action="/api/goods/manager/image/main/upload/"
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={this.addGoodsMainImageUrl}
                                >
                                    {this.state.newGoods.mainImageUrl ? <img style={{ width: 101, height: 101 }} src={this.state.newGoods.mainImageUrl} alt="avatar" /> : uploadButton}
                                </Upload><br /><br />
                            </Modal>
                        </div>
                        <EditableContext.Provider value={this.props.form}>
                            <div style={{ paddingBottom: 24 }}>
                                <Input style={{ width: 200 }} placeholder="商品名" allowClear onChange={this.keywordChange} />&nbsp;&nbsp;&nbsp;
                                <Select style={{ width: 100 }} placeholder='商品类别' allowClear onChange={this.qoCategoryChange}>
                                    {categoryList.map(function (data) {
                                        return <Option value={data.id} key={data.id}>{data.categoryName}</Option>;
                                    })}
                                </Select>&nbsp;&nbsp;&nbsp;
                                <Select style={{ width: 100 }} placeholder='上架状态' allowClear onChange={this.qoSaleStatusChange}>
                                    <Option value="1" key={1}>在售</Option>
                                    <Option value="0" key={0}>未上架</Option>
                                </Select>&nbsp;&nbsp;&nbsp;
                                <Button type='primary' onClick={() => this.changeGoodsList()}>搜索</Button>&nbsp;&nbsp;&nbsp;
                            </div>
                            <Table
                                loading={this.state.loading}
                                components={components}
                                bordered
                                dataSource={this.state.data}
                                pagination={paginationProps}
                                columns={columns}
                                expandIcon={CustomExpandIcon}
                                expandedRowRender={record => <PicturesWall
                                    id={record.id}
                                    imagesUrls={record.imagesUrls}
                                    goodsId={record.id}
                                ></PicturesWall>}
                            />
                        </EditableContext.Provider>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const GoodsManagerEditableFormTable = Form.create()(GoodsManager);

export default GoodsManagerEditableFormTable;