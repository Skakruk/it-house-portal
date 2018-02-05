import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import api from '../../helpers/api';

import './Login.less';

const FormItem = Form.Item;

class LoginContainer extends React.Component {
    state = {
        redirectToReferrer: false,
        loading: false,
    };

    componentWillMount() {
        if (this.props.user.loggedIn) {
            this.setState({ redirectToReferrer: true });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            loading: true,
        });

        this.props.form.validateFields((err, values) => {
            if (!err) {
                api.post('/auth/password', values).then((response) => {
                    localStorage.setItem('accessToken', response.accessToken);
                    this.props.dispatch({ type: 'LOGIN_SUCCESS' });
                    this.setState({ redirectToReferrer: true });
                    message.success('Welcome back!');
                }).catch((err) => {
                    if (err.status === 401) {
                        message.error('Invalid credentials.');
                    } else {
                        message.error('Something went wrong.');
                    }

                }).then(() => {
                    this.setState({
                        loading: false,
                    });
                })
            }
        });
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        const { getFieldDecorator } = this.props.form;

        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div className="container">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                   placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password"
                                   placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={this.state.loading}>
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default withRouter(connect(mapStateToProps)(Form.create()(LoginContainer)));
