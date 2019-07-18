import React from 'react';
import { connect } from 'react-redux';
import { activeListingsWithCoinDataSelector } from '../selectors';
import { Button, Divider, Icon, Table, Tooltip } from 'antd';
import CoinDetailsModal from './modals/CoinDetailsModal';
import BuyCoinModal from './modals/BuyCoinModal';
import _ from 'lodash';

class ListingTable extends React.Component {
    state = {
        filteredInfo: {},
        sortedInfo: {},
        isCoinDetailsModalOpen: false,
        isBuyCoinModalOpen: false,
        selectedListing: {},
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    handleDetailsClick = record => {
        this.setState({
            selectedListing: record,
            isCoinDetailsModalOpen: true,
        });
    }

    handleBuyClick = record => {
        this.setState({
            selectedListing: record,
            isBuyCoinModalOpen: true,
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
                title: 'Country',
                dataIndex: 'coin.country',
                key: 'country',
                ...this.createColumnFilter('country', 'coin.country'),
            },
            {
                title: 'Region',
                dataIndex: 'coin.region',
                key: 'region',
                ...this.createColumnFilter('region', 'coin.region'),
            },
            {
                title: 'City',
                dataIndex: 'coin.city',
                key: 'city',
                ...this.createColumnFilter('city', 'coin.city'),
            },
            {
                title: 'Type',
                dataIndex: 'coin.assetType',
                key: 'assetType',
                ...this.createColumnFilter('assetType', 'coin.assetType'),
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
                            <Divider type="vertical" />
                            <button
                                className="button-link button-link--colored"
                                onClick={this.handleBuyClick.bind(this, record)}
                            >
                                Buy
                            </button>
                        </span>
                    );
                },
            },
        ];
    }

    render() {
        const { listings, onPlaceBid, isBidRequestBusy } = this.props;
        const { selectedListing, isCoinDetailsModalOpen, isBuyCoinModalOpen } = this.state;

        return(
            <div className="listing-table">
                <div className="listing-table__content">
                    <div className="table-operations">
                        <Button onClick={this.clearAll}>Clear filters and sorters</Button>
                    </div>
                    <Table
                        columns={this.createColumns()}
                        onChange={this.handleChange}
                        dataSource={listings}
                        pagination={false}
                    />
                    <CoinDetailsModal
                        isOpen={isCoinDetailsModalOpen}
                        onCancel={this.handleModelCancel}
                        coin={selectedListing.coin}
                    />
                    <BuyCoinModal
                        isOpen={isBuyCoinModalOpen && !isBidRequestBusy}
                        onCancel={this.handleModelCancel}
                        listing={selectedListing}
                        onSubmit={onPlaceBid}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    listings: activeListingsWithCoinDataSelector(state),
});

export default connect(mapStateToProps, {})(ListingTable);
