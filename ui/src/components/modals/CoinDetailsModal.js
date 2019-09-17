import React from 'react';
import { Modal, List } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
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
                                description={
                                    <span className="break-all">{item.value}</span>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    )
};

CoinDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    coin: PropTypes.object.isRequired,
};

export default CoinDetailsModal;
