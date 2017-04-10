import React from "react";
import {Link} from "react-router";
import {Menu} from "semantic-ui-react";

import {connect} from "react-redux";
import {mapStateToProps} from "../transformer";

class AppMenu extends React.Component {

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor() {
        super();

        this._logout = this._logout.bind(this);
    }

    _logout() {
        this.props.dispatch({
            type: 'LOG_OUT'
        });
        this.context.router.replace("/login");
    }

    render() {
        //noinspection HtmlDeprecatedTag
        return (
            <div className='ui container'>
                <Menu stackable={true}>
                    <Menu.Item
                        name='dashboard'>
                        <Link to="/">Dashboard</Link>
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

export default connect(mapStateToProps)(AppMenu);

AppMenu.propTypes = {
    isLoggedIn: React.PropTypes.bool
};

AppMenu.propDefatul = {
    isLoggedIn: false
};
