import React from "react";
import {Link} from "react-router";
import {Menu} from "semantic-ui-react";

import {connect} from 'react-redux';
import {mapStateToProps} from "../transformer";

class App extends React.Component {

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

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
        this.context.router.replace("/login");
    }

    render() {
        return (
            <div className='ui container'>
                <Menu>
                    <Menu.Item
                        name='goals'>
                        <Link to="/">Goals</Link>
                    </Menu.Item>
                    <Menu.Item
                        name='buckets'>
                        <Link to="/buckets">Buckets</Link>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        {this.props.isLoggedIn &&
                        <Menu.Item name='logout' onClick={this._logout}>
                            {this.props.user.email}
                        </Menu.Item>
                        }
                    </Menu.Menu>
                </Menu>
                {this.props.children}
            </div>
        )
    }
}

export default connect(mapStateToProps)(App);
