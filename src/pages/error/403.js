import React from 'react'
import { Exception } from 'ant-design-pro';
import { Button } from 'antd';
import router from 'umi/router';
class Auth extends React.Component {
  render() {
      const actions = (
          <div>
              <Button type="primary" onClick={()=>{
                  router.push('/')
              }}>返回主页</Button>
          </div>
      );
    return (
        <Exception type="403" actions={actions} />
    )
  }
}
export default Auth;
