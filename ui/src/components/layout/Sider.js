import React from 'react';
import { Col } from 'antd';
import '../../styles/layout/Sider.less'

const Sider = props => (
    <Col span={6} className={`sider ${props.className}`}>
        {props.children}
    </Col>
)

export default Sider;
