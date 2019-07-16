import React from 'react';
import { Button, Table, Tag } from 'antd';
import EndListingModal from './modals/EndListingModal';
import _ from 'lodash';


class MyListingsTable extends React.Component {
    state = {
        filteredInfo: {},
        sortedInfo: {},
        isEndListingModalOpen: false,
        selectedListing: {},
    }

    tagColorsByState = {
        ACTIVE: 'green',
        ENDED: 'blue',
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    handleEndListingClick = record => {
        this.setState({
            selectedListing: record,
            isEndListingModalOpen: true,
        });
    }

    handleModelCancel = () => {
        this.setState({
            isEndListingModalOpen: false,
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
        const { listings } = this.props;

        const onFilter = (value, record) => _.get(record, path) === value;
        const filteredValue = filteredInfo[columnKey] || null;
        // Grab all unique values and format them
        const filters = _.map(
            _.uniqBy(listings, path),
            listing => ({ text: _.get(listing, path), value: _.get(listing, path) })
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
                dataIndex: 'listingId',
                key: 'listingId',
                ...this.createColumnSorter(
                    'listingId',
                    'listingId',
                    (r1, r2) => r1.listingId.localeCompare(r2.listingId)
                ),
            },
            {
                title: 'Price (CAD)',
                dataIndex: 'minPrice',
                key: 'minPrice',
                ...this.createColumnSorter('minPrice', 'minPrice'),
            },
            {
                title: 'Number of bids',
                dataIndex: 'bidPrices.length',
                key: 'numBids',
                ...this.createColumnSorter('numBids', 'bidPrices.length'),
            },
            {
                title: 'Highest bid',
                dataIndex: 'bidPrices',
                key: 'highestBid',
                ...this.createColumnSorter(
                    'highestBid',
                    'bidPrices', 
                    (a, b) => (_.max(a.bidPrices) || 0) - (_.max(b.bidPrices) || 0)
                ),
                render: (text, record) => _.max(record.bidPrices) || 'N/A'
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
                render: (text, record) => (
                    record.state === 'ACTIVE' &&
                    <button
                        className="button-link button-link--colored"
                        onClick={this.handleEndListingClick.bind(this, record)}
                    >
                        End Listing
                    </button>
                ),
            },
        ];
    }

    render() {
        const { listings, endListing } = this.props;
        const { selectedListing, isEndListingModalOpen } = this.state;
        return (
            <div className="my-coins">
                <h1>My Listings</h1>
                <div className="table-operations">
                    <Button onClick={this.clearAll}>Clear filters and sorters</Button>
                </div>
                <Table
                    columns={this.createColumns()}
                    onChange={this.handleChange}
                    dataSource={listings}
                    pagination={false}
                />
                <EndListingModal
                    isOpen={isEndListingModalOpen}
                    onCancel={this.handleModelCancel}
                    listing={selectedListing}
                    onSubmit={endListing}
                />
            </div>
        )
    }
}

export default MyListingsTable;
