import React from 'react';
import {
    Table, Input, Popconfirm, Form, Button, Card, Row, InputNumber, message, Upload, Modal, Icon,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import { addCourse, deleteCourse, getCourseManagerList, updateCourse } from '@/services/CourseService';
import { getCookie } from '@/util/cookie';
import router from 'umi/router';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const { TextArea } = Input;

class EditableCell extends React.Component {

    getInput = () => {
        if (this.props.inputType === 'hours') {
            return <InputNumber style={{ width: 50 }}/>;
        }
        if (this.props.inputType === 'price') {
            return <InputNumber precision={2} style={{ width: 60 }}/>;
        }
        return <Input/>;
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

class CourseManager extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [
            { title: '课程ID', dataIndex: 'id', width: '7%' },
            { title: '课程名', dataIndex: 'courseName', width: '10%', editable: true },
            { title: '教师', dataIndex: 'teacherName', width: '7%', editable: true },
            { title: '联系方式', dataIndex: 'teacherTel', width: '7%', editable: true },
            {
                title: '主图',
                dataIndex: 'mainImageUrl',
                width: '7%',
                render: text => <img style={{ height: 100, width: 170 }} alt='' src={text}/>,
            },
            { title: '原价', dataIndex: 'courseOriginPrice', width: '6%', editable: true, inputType: 'price' },
            { title: '折扣价', dataIndex: 'courseDiscountPrice', width: '6%', editable: true, inputType: 'price' },
            { title: '时长/h', dataIndex: 'courseHours', width: '7%', editable: true, inputType: 'hours' },
            { title: '付款人数', dataIndex: 'paidNumber', width: '9%' },
            { title: '地点', dataIndex: 'coursePlace', width: '10%', editable: true },
            {
                title: '操作',
                width: '18%',
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
                                        title="确认删除?"
                                        onConfirm={() => this.delete(record.key)}>
                                            <Button type='danger'>删除</Button>
                                    </Popconfirm>&nbsp;&nbsp;
                                    <p/>
                                    <Button type='primary'  onClick={()=>{
                                        router.push({
                                            pathname: '/courseDetails',
                                            query: {
                                                courseId: record.key,
                                            },
                                        });
                                    }}>详情</Button>
                                    </span>
                            )}
                        </div>
                    );
                },
            },
        ];
    }

    state = {
        loading: false,
        uploadLoading: false,
        visible: false,
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
        editingKey: '',
        newCourse: {},
    };

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);
        this.reloadCourseList();
    }

    //重载列表
    reloadCourseList() {
        this.setState({
            loading: true,
        });
        let courseQO = {
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
        };
        getCourseManagerList(courseQO).then((result) => {
            console.log(result);
            let data = [];
            result.data.list.map((course) => {
                data.push({
                    ...course, key: course.id,
                });
                return null;
            });
            this.setState({
                data: data,
                pagination: {
                    ...this.state.pagination,
                    total: result.data.total,
                },
                loading: false,
            });
        });
    }


    //页码改变方法
    pageChange(pageNum) {
        const pageInfo = { ...this.state.pagination };
        pageInfo.current = pageNum;
        this.setState({ pagination: pageInfo }, () => {
            this.reloadCourseList();
        });
    }

    isEditing = record => record.key === this.state.editingKey;
    cancel = () => {
        this.setState({ editingKey: '' });
    };


    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            console.log(row);
            this.updateCourse({ ...row, id: key });
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

    //修改
    updateCourse(course) {
        console.log(course);
        updateCourse(course).then((result) => {
            CourseManager.showMessage(result);
        });
    }

    //删除
    delete(id) {
        console.log(id);
        deleteCourse(id).then((result) => {
            CourseManager.showMessage(result);
            this.reloadCourseList();
        });
    }

    static showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
        } else {
            message.error(result.msg, 1);
        }
    }

    edit(key) {
        this.setState({ editingKey: key });
    }


    //下面这三个方法是添加商品modal的操作;
    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({ visible: false, newCourse: {} });
    };
    handleOk = (e) => {
        this.setState({ visible: false });
        console.log(this.state.newCourse);
        addCourse(this.state.newCourse).then((result) => {
            console.log(result);
            if (result.success) {
                message.success(result.msg);
                this.reloadCourseList();
            } else {
                message.error(result.msg);
            }
            this.setState({ newCourse: {} });
        });
    };

    addCourseName = (e) => {
        this.setState({ newCourse: { ...this.state.newCourse, courseName: e.target.value } });
    };
    addCourseIntroduction = (e) => {
        this.setState({ newCourse: { ...this.state.newCourse, courseIntroduction: e.target.value } });
    };
    addCourseContent = (e) => {
        this.setState({ newCourse: { ...this.state.newCourse, courseContent: e.target.value } });
    };
    addTeacherName = (e) => {
        this.setState({ newCourse: { ...this.state.newCourse, teacherName: e.target.value } });
    };
    addTeacherTel = (e) => {
        this.setState({ newCourse: { ...this.state.newCourse, teacherTel: e.target.value } });
    };
    addCourseOriginPrice = (value) => {
        this.setState({ newCourse: { ...this.state.newCourse, courseOriginPrice: value } });
    };
    addCourseDiscountPrice = (value) => {
        this.setState({ newCourse: { ...this.state.newCourse, courseDiscountPrice: value } });
    };
    addCourseHours = (value) => {
        this.setState({ newCourse: { ...this.state.newCourse, courseHours: value } });
    };
    addCoursePlace = (e) => {
        this.setState({ newCourse: { ...this.state.newCourse, coursePlace: e.target.value } });
    };
    addCourseMainImageUrl = (info) => {
        console.log('file');
        console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ uploadLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                uploadLoading: false,
                newCourse: {
                    ...this.state.newCourse, mainImageUrl: info.file.response.data,
                },
            });
        }
    };

    render() {
        const components = { body: { cell: EditableCell } };

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
                <Icon type={this.state.uploadLoading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <React.Fragment>
                <div style={{ background: '#fff' }}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-around" align="middle">
                            <font size={3}>课程管理</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}/>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>
                        <Button onClick={this.showModal}>添加课程</Button><br/><br/>
                        <Modal
                            title="请输入需要课程信息"
                            okText='添加'
                            cancelText='取消'
                            destroyOnClose
                            closable={false}
                            style={{ top: 20 }}
                            visible={this.state.visible}
                            footer={[
                                <Popconfirm
                                    key={'cancelPop'}
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
                            <label>课程名称：</label><Input style={{ width: 200 }}
                                                       onChange={this.addCourseName}/><br/><br/>
                            <label>课程简介：</label><TextArea style={{ width: 200 }}
                                                          onChange={this.addCourseIntroduction}/><br/><br/>
                            <label>课程内容：</label><TextArea style={{ width: 200, height: 100 }}
                                                          onChange={this.addCourseContent}/>&nbsp;建议分点以英文分号(;)隔开<br/><br/>
                            <label>课程教师：</label><Input style={{ width: 200 }}
                                                       onChange={this.addTeacherName}/><br/><br/>
                            <label>联系方式：</label><Input style={{ width: 200 }}
                                                       onChange={this.addTeacherTel}/><br/><br/>
                            <label>课程原价：</label><InputNumber precision={2} style={{ width: 200 }}
                                                             onChange={this.addCourseOriginPrice}/><br/><br/>
                            <label>折扣价格：</label><InputNumber precision={2} style={{ width: 200 }}
                                                             onChange={this.addCourseDiscountPrice}/><br/><br/>
                            <label>课程时长：</label><InputNumber style={{ width: 200 }}
                                                             onChange={this.addCourseHours}/><br/><br/>
                            <label>课程地点：</label><Input style={{ width: 200 }}
                                                       onChange={this.addCoursePlace}/><br/><br/>
                            <Upload
                                action="/api/course/manager/image/main/upload/"
                                listType="picture-card"
                                showUploadList={false}
                                headers={{ 'ACCESS_TOKEN': getCookie('ACCESS_TOKEN') }}
                                onChange={this.addCourseMainImageUrl}
                            >
                                {this.state.newCourse.mainImageUrl ?
                                    <img style={{ width: 101, height: 101 }} src={this.state.newCourse.mainImageUrl}
                                         alt="avatar"/> : uploadButton}
                            </Upload><br/><br/>
                        </Modal>
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                loading={this.state.loading}
                                components={components}
                                bordered
                                pagination={paginationProps}
                                columns={columns}
                                dataSource={this.state.data}
                            />
                        </EditableContext.Provider>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const CourseManagerEditableFormTable = Form.create()(CourseManager);

export default CourseManagerEditableFormTable;
