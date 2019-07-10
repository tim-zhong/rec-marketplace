import React from 'react';
import { connect } from 'react-redux';
import { hyperledgerClient } from '../helpers/hyperledgerClient';
import { bidsSelector, listingsWithCoinDataSelector } from '../selectors';
import { Button, Divider, Icon, Table, Tooltip } from 'antd';
import CoinDetailsModal from './modals/CoinDetailsModal';
import BuyCoinModal from './modals/BuyCoinModal';
import _ from 'lodash';
import '../styles/ListingTable.less';

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
        this.props.fetchBidsByListing(record.listingId);
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
    
    getBidsForSelectedListing = () => {
        const { bids } = this.props;
        const { selectedListing } = this.state; 
        
        // Although _.filter has a linear time complexity, the number of bids here is usually tiny
        // as we only fetch a small number of bids each time. Will keep it for now until there's a
        // better approach.
        return _.filter(
            bids,
            (bid => hyperledgerClient.getIdFromRefString(bid.listing) === selectedListing.listingId)
        );
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

    createColumnSorter = (columnKey, path) => {
        let { sortedInfo } = this.state;

        const sorter = (a, b) => _.get(a, path) - _.get(b, path);
        const sortDirections = ['descend', 'ascend'];
        const sortOrder = sortedInfo.columnKey === columnKey && sortedInfo.order;

        return { sorter, sortDirections, sortOrder };
    }
    
    createColumns = () => {
        const { isBidRequestBusy } = this.props;
        const { selectedListing } = this.state;
        return [
            {
                title: 'Id',
                dataIndex: 'listingId',
                key: 'listingId',
                ...this.createColumnSorter('listingId','listingId'),
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
                title: 'Actions',
                key: 'actions',
                render: (text, record) => {
                    const isBuyButtonDistabled = isBidRequestBusy && selectedListing.listingId === record.listingId;
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
                                disabled={isBuyButtonDistabled}
                            >
                                {isBuyButtonDistabled ?  <Icon type="loading" /> : 'Buy'}
                            </button>
                        </span>
                    );
                },
            },
        ];
    }

    render() {
        const { listings, isDataReady, onPlaceBid, isBidRequestBusy } = this.props;
        const { selectedListing, isCoinDetailsModalOpen, isBuyCoinModalOpen } = this.state;

        return(
            <div className="listing-table">
                {isDataReady &&
                    <div className="listing-table__content">
                        <div className="listing-table__operations">
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
                            bids={this.getBidsForSelectedListing()}
                            onSubmit={onPlaceBid}
                        />
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    listings: listingsWithCoinDataSelector(state),
    isDataReady: state.assets.listings.requestState.success
        && state.assets.coins.requestState.success,
    bids: bidsSelector(state),
    isBidRequestBusy: state.assets.bids.requestState.busy,
});

export default connect(mapStateToProps, {})(ListingTable);
