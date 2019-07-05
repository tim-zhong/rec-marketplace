import React from 'react';
import { connect } from 'react-redux';
import { listingsWithCoinDataSelector } from '../selectors';
import { Button, Table } from 'antd';
import _ from 'lodash';
import '../styles/ListingTable.less';

class ListingTable extends React.Component {
    state = {
        filteredInfo: {},
        sortedInfo: {},
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
                title: 'Price',
                dataIndex: 'minPrice',
                key: 'minPrice',
                ...this.createColumnSorter('minPrice', 'minPrice'),
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <button className="button-link button-link--colored">Buy</button>
                    </span>
                ),
            },
        ];
    }

    render() {
        const { listings, isDataReady } = this.props;

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
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    listings: listingsWithCoinDataSelector(state),
    isDataReady: state.assets.listings.success && state.assets.coins.success,
});

export default connect(mapStateToProps, {})(ListingTable);
