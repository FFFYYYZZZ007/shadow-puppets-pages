import React from 'react'
import RenderAuthorized from 'ant-design-pro/lib/Authorized';
import { Alert } from 'antd';

const { Secured } = RenderAuthorized('user');

@Secured('admin')
class TestSecuredString extends React.Component {
  render() {
    return (
      <Alert message="user Passed!" type="success" showIcon />
    )
  }
}
export default TestSecuredString;