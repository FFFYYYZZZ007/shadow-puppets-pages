import React from 'react';
import { Carousel } from 'antd';

class MyCarousel extends React.Component {
    render() {
        return (
            <div>
                <Carousel autoplay>
                    <div><img alt="" src={"http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/20190403/jpg/a0d5b42cee71e2452f077897f29bee00.jpg"}/></div>
                    <div><img alt="" src={"http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/20190403/jpg/a0d5b42cee71e2452f077897f29bee00.jpg"}/></div>
                    <div><img alt="" src={"http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/20190403/jpg/a0d5b42cee71e2452f077897f29bee00.jpg"}/></div>
                    <div><img alt="" src={"http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/20190403/jpg/a0d5b42cee71e2452f077897f29bee00.jpg"}/></div>
                </Carousel>
            </div>
        );
    };
}

export default MyCarousel;