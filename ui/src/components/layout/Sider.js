import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import '../../styles/layout/Sider.less'

const Sider = props => (
    <Col span={6} className={`sider ${props.className || ''}`}>
        {props.children}
    </Col>
)

Sider.propTypes = {
    className: PropTypes.string,
};

export default Sider;
