import React from 'react';
import { Col } from 'antd';
import '../../styles/layout/Content.less';

const Content = props => (
    <Col span={18} className="content">
        <main>
            {props.children}
        </main>
    </Col>
);

export default Content;
