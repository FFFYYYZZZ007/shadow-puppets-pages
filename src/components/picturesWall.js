import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { removeGoodsImage } from '../services/GoodsService'

class PicturesWall extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            loading: false
        }
    }

    componentDidMount() {
        let imagesUrls = this.props.imagesUrls;
        let goodsId = this.props.goodsId;
        console.log(goodsId)
        let imageList = [];
        let num = -1;
        imagesUrls.split(',').map((imageUrl) => {
            if (imageUrl === undefined || imageUrl === '') { return null; }
            imageList.push({
                uid: num,
                name: num--,
                status: 'done',
                url: imageUrl
            });
            return null
        });
        console.log(imageList);
        this.setState({
            fileList: imageList
        })
    }


    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleRemove = (file) => {
        removeGoodsImage(this.props.goodsId, file.url).then((result) => {
            if(result.success){message.success(result.msg)}
        })
    }

    handleChange = ({ fileList }) => {
        let length = fileList.length;
        let newFile = fileList[length - 1];
        //将图片列表中每个图片的数据字段统一
        if (newFile.response !== undefined && newFile.response.data !== undefined) {
            newFile = {
                uid: newFile.uid,
                status: newFile.status,
                url: newFile.response.data
            };
        }
        fileList[length - 1] = newFile;
        this.setState({ fileList });
    }

    render() {
        var { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <span>最多只能上传十张图片</span>
                <Upload
                    action={"/api/goods/manager/image/add?goodsId=" + this.props.goodsId}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.handleRemove}
                >
                    {fileList.length >= 10 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;