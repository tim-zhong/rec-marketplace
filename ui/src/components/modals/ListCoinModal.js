import React from 'react';
import { Form, Modal, List, InputNumber } from 'antd';
import _ from 'lodash';

const fieldsToDisplay = [
    { key: 'coinId', title: 'ID' },
    { key: 'country', title: 'Country' },
    { key: 'region', title: 'Region' },
    { key: 'city', title: 'City' },
    { key: 'assetType', title: 'Type' },
];

class ListCoinModal extends React.Component {
    handleSubmit = e => {
        e && e.preventDefault();
        const { coin, onSubmit } = this.props;
        this.props.form.validateFields((err,values)=>{
            if (!err) {
                const { minPrice } = values;
                onSubmit(minPrice, coin.coinId);
                // close the modal
                this.handleCancel();
            }
        });
    }
    
    handleCancel = () => {
        const { onCancel, form: { resetFields } } = this.props;
        // clear fields
        resetFields();
        onCancel();
    }

    render() {
        const { coin, isOpen, form: { getFieldDecorator } } = this.props;

        // Pick fields form coin using fieldsToDisplay
        const fieldsData = _.map(fieldsToDisplay, ({ key, title }) => ({
            title,
            value: coin[key],
        }));

        return (
            <Modal
                title="Sell Coin"
                visible={isOpen}
                onCancel={this.handleCancel}
                okText="Create listing"
                onOk={this.handleSubmit}
            >
                <List
                    header="Coin Summary"
                    itemLayout="horizontal"
                    size="small"
                    dataSource={fieldsData}
                    renderItem={({ title, value }) => (
                        <List.Item>
                            <List.Item.Meta description={title}/>
                            <div>{value}</div>
                        </List.Item>
                    )}
                />
                <Form onSubmit={this.handleSubmit} layout="inline">
                    <Form.Item label="Set a minumum price:">
                        {getFieldDecorator('minPrice', { rules: [
                            { required: true, message: 'Please specify a minimum price'}
                        ]})(
                            <InputNumber
                                min={1}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ListCoinModal);
