import React from 'react';
import { Menu, Dropdown, Icon, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/layout/Header.less';

const userMenu = (
    <Menu>
        <Menu.Item key="0">
            <Link to="/login">Logout</Link>
        </Menu.Item>
    </Menu>
);

const Header = props => (
    <header className={`header ${props.className || ''}`}>
        <Row className="header__inner">
            <Col span={6} className="header__logo">
            <Link to="/">REC SYSTEM</Link>
            </Col>
            <Col span={18}>
                <Dropdown className="header__user" overlay={userMenu} trigger={['click']}>
                    <button className="button-link">
                        <Icon type="user" /> {props.user.firstName} <Icon type="down"/>
                    </button>
                </Dropdown>
                <Menu mode="horizontal" className="header__nav" defaultSelectedKeys={[props.selected]}>
                    <Menu.Item key="home">
                        <Link to="/">Marketplace</Link>
                    </Menu.Item>
                    <Menu.Item key="dashboard">
                        <Link to="/dashboard/coins">My Dashboard</Link>
                    </Menu.Item>
                </Menu> 
            </Col>
        </Row>
    </header>
);

Header.protoTypes = {
    user: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default Header;
