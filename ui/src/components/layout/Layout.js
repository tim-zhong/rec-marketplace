import React from 'react';
import Header from './Header';
import Sider from './Sider';
import Content from './Content';
import Loading from './Loading';
import { Row } from 'antd'

class Layout extends React.Component {
    render() {
        return (
            <Row type="flex" justify="space-around">
                {this.props.children}
            </Row>
        )
    }
}

Layout.Header = Header;
Layout.Sider = Sider;
Layout.Content = Content;
Layout.Loading = Loading;

export default Layout;
