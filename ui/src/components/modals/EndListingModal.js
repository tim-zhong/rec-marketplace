import React from 'react';
import { Descriptions, Modal, List } from 'antd';
import format from 'format-number';
import _ from 'lodash';
import '../../styles/modals/EndListingModal.less';

const formater = format({ prefix: '$' });
const coinFieldsToDisplay = [
    { key: 'coinId', title: 'ID' },
    { key: 'country', title: 'Country' },
    { key: 'region', title: 'Region' },
    { key: 'city', title: 'City' },
    { key: 'assetType', title: 'Type' },
];

class EndListingModal extends React.Component {
    handleSubmit = () => {
        const { listing, onSubmit, onCancel } = this.props;
        onSubmit(listing.listingId);
        onCancel();
    }

    render() {
        const { isOpen, listing, onCancel } = this.props;
        const { coin = {}, bidPrices = [] } = listing;
        
        // Pick fields form coin using fieldsToDisplay
        const coinFieldsData = _.map(coinFieldsToDisplay, ({ key, title }) => ({
            title,
            value: coin[key],
        }));

        return(
            <Modal
                className="end-listing-modal"
                title="End Listing"
                visible={isOpen}
                onOk={this.handleSubmit}
                onCancel={onCancel}
                okText={
                    bidPrices.length 
                        ? "Sell to the highest bidder"
                        : "End listing"
                }
            >
                <List
                    header="Coin Summary"
                    itemLayout="horizontal"
                    size="small"
                    dataSource={coinFieldsData}
                    renderItem={({ title, value }) => (
                        <List.Item>
                            <List.Item.Meta description={title}/>
                            <div>{value}</div>
                        </List.Item>
                    )}
                />
                {!!bidPrices.length &&
                    <Descriptions column={1} size="small" className="end-listing-modal__listing-info">
                        <Descriptions.Item label="Number of Bids">{bidPrices.length}</Descriptions.Item>
                        <Descriptions.Item label="Highest Bid">{formater(_.max(bidPrices))}</Descriptions.Item>
                    </Descriptions>
                }
            </Modal>
        )
    }
}

export default EndListingModal;
