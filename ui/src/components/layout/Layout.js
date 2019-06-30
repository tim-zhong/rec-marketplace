import React from 'react';
import Header from './Header';
import Sider from './Sider';
import Content from './Content';

class Layout extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

Layout.Header = Header;
Layout.Sider = Sider;
Layout.Content = Content;

export default Layout;
