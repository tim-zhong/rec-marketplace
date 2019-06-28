import React from 'react';
import { Form, Input, Button, Icon } from "antd";

class LoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if (!err) {
                const { username, password } = values;
                this.props.login(username, password);
            }
        });
    }
    render() {
        const { isLoggingIn, form: { getFieldDecorator } } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username.' }]
                    })(
                        <Input
                            size="large"
                            prefix={<Icon type="user"/>}
                            placeholder="Username"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your password.' }]
                        })(
                            <Input
                                size="large"
                                prefix={<Icon type="lock" />}
                                type="password"
                                placeholder="Password"
                            />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        disabled={isLoggingIn}
                    >
                        LOGIN
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}


export default Form.create()(LoginForm);