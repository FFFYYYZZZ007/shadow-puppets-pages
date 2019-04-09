import React from 'react';
import MyCarousel from '../components/MyCarousel.js';
import GoodsMenu from '../components/index/GoodsMenu.js';
import CourseMenu from '../components/index/CourseMenu.js';

class index extends React.Component{

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    };

    render() {
        return (
            <div>
              <MyCarousel />
              <GoodsMenu />
              <CourseMenu />
            </div>
          );
    }
}

export default index;
