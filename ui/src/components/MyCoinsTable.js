import React from 'react';
import { Button, Tag, Table, Tooltip, Icon } from 'antd';
import _ from 'lodash';
import CoinDetailsModal from './modals/CoinDetailsModal';
import '../styles/MyCoinsTable.less';

class MyCoinsTable extends React.Component {
    state = {
        filteredInfo: {},
        sortedInfo: {},
        isCoinDetailsModalOpen: false,
        isListCoinModalOpen: false,
        selectedCoin: {},
    }

    tagColorsByState = {
        ACTIVE: 'green',
        LISTED: 'gold',
        CANCELLED: 'red',
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    handleDetailsClick = record => {
        this.setState({
            selectedCoin: record,
            isCoinDetailsModalOpen: true,
        });
    }

    handleListClick = record => {
        this.setState({
            selectedCoin: record,
            isListCoinModalOpen: true,
        });
    }

    handleModelCancel = () => {
        this.setState({
            isCoinDetailsModalOpen: false,
            isBuyCoinModalOpen: false,
        });
    }

    clearAll = () => {
        this.setState({
            filteredInfo: {},
            sortedInfo: {},
        });
    }

    createColumnFilter = (columnKey, path) => {
        const { filteredInfo } = this.state;
        const { coins } = this.props;

        const onFilter = (value, record) => _.get(record, path) === value;
        const filteredValue = filteredInfo[columnKey] || null;
        // Grab all unique values and format them
        const filters = _.map(
            _.uniqBy(coins, path),
            coin => ({ text: _.get(coin, path), value: _.get(coin, path) })
        );
        
        return { filters, onFilter, filteredValue };
    }

    createColumnSorter = (columnKey, path) => {
        let { sortedInfo } = this.state;

        const sorter = (a, b) => _.get(a, path) - _.get(b, path);
        const sortDirections = ['descend', 'ascend'];
        const sortOrder = sortedInfo.columnKey === columnKey && sortedInfo.order;

        return { sorter, sortDirections, sortOrder };
    }
    
    createColumns = () => {
        return [
            {
                title: 'Id',
                dataIndex: 'coinId',
                key: 'coinId',
                ...this.createColumnSorter('coinId','coinId'),
            },
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                ...this.createColumnFilter('country', 'country'),
            },
            {
                title: 'Region',
                dataIndex: 'region',
                key: 'region',
                ...this.createColumnFilter('region', 'region'),
            },
            {
                title: 'City',
                dataIndex: 'city',
                key: 'city',
                ...this.createColumnFilter('city', 'city'),
            },
            {
                title: 'Type',
                dataIndex: 'assetType',
                key: 'assetType',
                ...this.createColumnFilter('assetType', 'assetType'),
            },
            {
                title: 'State',
                dataIndex: 'state',
                key: 'state',
                ...this.createColumnFilter('state', 'state'),
                render: (text, record) => (
                    <Tag color={this.tagColorsByState[record.state]}>
                        {record.state}
                    </Tag>
                )
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (text, record) => {
                    return (
                        <span>
                            <Tooltip placement="left" title="View Details" mouseEnterDelay={1} >
                                <button
                                    className="button-link button-link--colored"
                                    onClick={this.handleDetailsClick.bind(this, record)}
                                >
                                        <Icon type="eye" />
                                </button>
                            </Tooltip>
                        </span>
                    );
                },
            },
        ];
    }

    render() {
        const { coins } = this.props;
        const { selectedCoin, isCoinDetailsModalOpen } = this.state;
        return (
            <div className="my-coins">
                <h1>My Coins</h1>
                <div className="my-coins__table-operations">
                    <Button onClick={this.clearAll}>Clear filters and sorters</Button>
                </div>
                <Table
                    columns={this.createColumns()}
                    onChange={this.handleChange}
                    dataSource={coins}
                    pagination={false}
                />
                <CoinDetailsModal
                    isOpen={isCoinDetailsModalOpen}
                    onCancel={this.handleModelCancel}
                    coin={selectedCoin}
                />
            </div>
        )
    }
}

export default MyCoinsTable;
