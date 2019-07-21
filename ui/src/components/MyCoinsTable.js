import React from 'react';
import { Button, Tag, Table, Tooltip, Icon, Divider, Modal } from 'antd';
import _ from 'lodash';
import CoinDetailsModal from './modals/CoinDetailsModal';
import ListDetailsModal from './modals/ListCoinModal';
import PropTypes from 'prop-types';

const { confirm } = Modal;

class MyCoinsTable extends React.Component {
    state = {
        filteredInfo: {},
        sortedInfo: {},
        isCoinDetailsModalOpen: false,
        isListCoinModalOpen: false,
        isCancelCoinModalOpen: false,
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

    handleCancelClick = record => {
        this.setState({
            selectedCoin: record,
        }, this.showConcelConfirm.bind(this, record));
    }

    showConcelConfirm = record => {
        const { cancelCoin } = this.props;
        confirm({
          title: 'Are you sure you want to cancel this coin?',
          content: 'This process cannot be undone.',
          okText: 'Yes. Cancel coin',
          okType: 'danger',
          cancelText: 'No. Keep coin',
          onOk: cancelCoin.bind(this, record.coinId),
        });
      }

    handleModelCancel = () => {
        this.setState({
            isCoinDetailsModalOpen: false,
            isListCoinModalOpen: false,
            isCancelCoinModalOpen: false,
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
                ...this.createColumnSorter(
                    'coinId',
                    'coinId',
                    (r1, r2) => r1.coinId.localeCompare(r2.coinId)
                ),
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
                    const isCoinActive = record.state === 'ACTIVE';
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
                            {isCoinActive &&
                                <span>
                                    <Divider type="vertical" />
                                    <button
                                        className="button-link button-link--colored"
                                        onClick={this.handleCancelClick.bind(this, record)}
                                    >
                                        Cancel
                                    </button>
                                    <Divider type="vertical" />
                                    <button
                                        className="button-link button-link--colored"
                                        onClick={this.handleListClick.bind(this, record)}
                                    >
                                        Sell
                                    </button>
                                </span>
                            }
                        </span>
                    );
                },
            },
        ];
    }

    render() {
        const { coins, sellCoin } = this.props;
        const { selectedCoin, isCoinDetailsModalOpen, isListCoinModalOpen } = this.state;
        return (
            <div className="my-coins">
                <h1>My Coins</h1>
                <div className="table-operations">
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
                <ListDetailsModal
                    isOpen={isListCoinModalOpen}
                    onCancel={this.handleModelCancel}
                    coin={selectedCoin}
                    onSubmit={sellCoin}
                />
            </div>
        )
    }
}

MyCoinsTable.propTypes = {
    coins: PropTypes.array.isRequired,
    sellCoin: PropTypes.func.isRequired,
    cancelCoin: PropTypes.func.isRequired,
};

export default MyCoinsTable;
