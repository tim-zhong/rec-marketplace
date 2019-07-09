import React from 'react';
import { Descriptions, Button, Modal, Row, Col, Form, InputNumber } from 'antd';
import _ from 'lodash';
import format from 'format-number';
import '../../styles/modals/BuyCoinModal.less';

const formater = format({ prefix: '$' });

class BuyCoinModal extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if (!err) {
                const { bid } = values;
                this.props.onSubmit(bid);
            }
        });
    }

    render() {
        const { bids, listing, isOpen, onCancel, form: { getFieldDecorator } } = this.props;
        const sortedBids = _.sortBy(bids, ['bidPrice']);
        const numBids = sortedBids.length;
        const startingBid = listing.minPrice;
        const highestBid = numBids ? sortedBids[numBids - 1].bidPrice : 0;
        const minBid = Math.max(highestBid, startingBid) + 1;

        return (
            <Modal
                className="coin-details-modal"
                title="Buy Coin"
                visible={isOpen}
                onCancel={onCancel}
                footer={null}
            >
                <div className="coin-details-modal__info-container">
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="Starting Bid">{formater(startingBid)}</Descriptions.Item>
                        <Descriptions.Item label="Number of Bids">{numBids}</Descriptions.Item>
                        <Descriptions.Item label="Current Bid">{formater(highestBid)}</Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="coin-details-modal__form-container">
                    <Form
                        onSubmit={this.handleSubmit}
                        labelCol={{span: 11}}
                        wrapperCol={{span: 11, offset: 2}}
                        layout="inline"
                    >
                        <Row>
                            <Col span={10}>
                                <Form.Item label="Your Bid">
                                    {getFieldDecorator('bid', { rules: [{ required: true }]})(
                                        <InputNumber
                                            placeholder={minBid}
                                            min={minBid}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={14} style={{ textAlign: 'right' }}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Register
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <p className="coin-details-modal__price-message">Enter CAD {formater(minBid)} or more</p>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default Form.create()(BuyCoinModal);
