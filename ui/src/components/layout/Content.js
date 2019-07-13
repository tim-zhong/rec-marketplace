import React from 'react';
import { Col } from 'antd';
import '../../styles/layout/Content.less';

const Content = props => (
    <Col offset={6} span={18} className={`content ${props.className || ''}`} {...props}>
        <main>
            {props.children}
        </main>
    </Col>
);

export default Content;
