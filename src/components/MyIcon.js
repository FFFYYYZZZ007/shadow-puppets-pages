import React from 'react';
import { Icon } from 'antd';
class MyIcon extends React.Component {
    render(){
        return (
            <div>
                <Icon theme="filled" type={this.props.type}/>
                {this.props.name}
            </div>
        )
    }
}

export default MyIcon;