import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import '../../styles/layout/Content.less';

const Content = props => (
    <Col offset={6} span={18} className={`content ${props.className || ''}`} {...props}>
        <main>
            {props.children}
        </main>
    </Col>
);

Content.propTypes = {
    className: PropTypes.string,
};

export default Content;
