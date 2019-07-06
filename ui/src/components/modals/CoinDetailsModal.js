import React from 'react';
import { Modal, List } from 'antd';
import _ from 'lodash';
import '../../styles/modals/CoinDetailsModal.less';

const CoinDetailsModal = props => {
    const { coin, isOpen, onCancel } = props;
    // Format coin object into an array of key-value pairs
    const coinDetails = _.map(coin, (value, title) => ({ title, value }));

    return (
        <Modal
            className="coin-details-modal"
            title="Coin Details"
            visible={isOpen}
            onCancel={onCancel}
            footer={null}
        >
            <div className="coin-details-modal__list-container">
                <List
                    itemLayout="horizontal"
                    dataSource={coinDetails}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={item.value}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    )
};

export default CoinDetailsModal;
