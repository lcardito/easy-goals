import React from 'react';

import {connect} from 'react-redux';
import {mapStateToProps} from "../transformer";

class LoginForm extends React.Component {
    constructor() {
        super();

        this._login = this._login.bind(this);
        this._logout = this._logout.bind(this);
    }

    _login() {
        this.props.dispatch({
            type: 'LOG_IN'
        });
    }

    _logout() {
        this.props.dispatch({
            type: 'LOG_OUT'
        });
    }

    render() {
        return null;

    }
}

export default connect(mapStateToProps)(LoginForm);