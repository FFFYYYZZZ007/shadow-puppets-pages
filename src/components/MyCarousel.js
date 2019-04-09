import React from 'react';
import { Carousel } from 'antd';

class MyCarousel extends React.Component {
    render() {
        return (
            <div>
                <Carousel autoplay>
                    <div><img alt="" src={"http://fuyuaaa-bucket.oss-cn-hangzhou.aliyuncs.com/pics/%E9%A6%96%E9%A1%B51.jpg"}/></div>
                    <div><img alt="" src={"http://fuyuaaa-bucket.oss-cn-hangzhou.aliyuncs.com/pics/%E9%A6%96%E9%A1%B52.jpg"}/></div>
                    <div><img alt="" src={"http://fuyuaaa-bucket.oss-cn-hangzhou.aliyuncs.com/pics/%E9%A6%96%E9%A1%B53.jpg"}/></div>
                </Carousel>
            </div>
        );
    };
}

export default MyCarousel;