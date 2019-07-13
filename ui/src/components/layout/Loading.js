import React from 'react';
import { Icon } from 'antd';
import '../../styles/layout/Loading.less';

// TODO: disable scrolling?
const Loading = props => (
    <div className="loading">
        <Icon className="loading__icon" type="loading" style={{ fontSize: 80 }} />
    </div>
)

export default Loading;
