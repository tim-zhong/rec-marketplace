import React from 'react';
import { hyperledgerClient } from '../helpers/hyperledgerClient';
import { Tag, Table, Button } from 'antd';
import _ from 'lodash';

class MyBidsTable extends React.Component {
    state = {
        filteredInfo: {},
        sortedInfo: {},
    }

    tagColorsByState = {
        SUBMITTED: 'gold',
        SUCCESSFUL: 'green',
        UNSUCCESSFUL: 'red',
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
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
        const { bids } = this.props;

        const onFilter = (value, record) => _.get(record, path) === value;
        const filteredValue = filteredInfo[columnKey] || null;
        // Grab all unique values and format them
        const filters = _.map(
            _.uniqBy(bids, path),
            bid => ({ text: _.get(bid, path), value: _.get(bid, path) })
        );
        
        return { filters, onFilter, filteredValue };
    }

    createColumnSorter = (columnKey, path, sorterFn) => {
        let { sortedInfo } = this.state;

        const sorter = sorterFn === undefined
            ? (a, b) => _.get(a, path) - _.get(b, path)
            : sorterFn;
        const sortDirections = ['descend', 'ascend'];
        const sortOrder = sortedInfo.columnKey === columnKey && sortedInfo.order;

        return { sorter, sortDirections, sortOrder };
    }

    createColumns = () => {
        return [
            {
                title: 'Id',
                dataIndex: 'bidId',
                key: 'bidId',
                ...this.createColumnSorter(
                    'bidId',
                    'bidId',
                    (r1, r2) => r1.bidId.localeCompare(r2.bidId)
                ),
            },
            {
                title: 'Lising ID',
                dataIndex: 'listing',
                key: 'listing',
                ...this.createColumnSorter(
                    'listing',
                    'listing',
                    (r1, r2) => r1.listing.localeCompare(r2.listing)
                ),
                render: (text, record) => hyperledgerClient.getIdFromRefString(record.listing),
            },
            {
                title: 'Bid Price',
                dataIndex: 'bidPrice',
                key: 'bidPrice',
                ...this.createColumnSorter('bidPrice', 'bidPrice'),
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
                ),
            },
        ];
    }

    render() {
        const { bids } = this.props;
        return (
            <div className="my-bids">
                <h1>My Bids</h1>
                <div className="table-operations">
                    <Button onClick={this.clearAll}>Clear filters and sorters</Button>
                </div>
                <Table
                    columns={this.createColumns()}
                    onChange={this.handleChange}
                    dataSource={bids}
                    pagination={false}
                />
            </div>
        )
    }
}

export default MyBidsTable;
