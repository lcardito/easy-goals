import React from 'react'
import {Menu} from 'semantic-ui-react'

class AppMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.initialActiveItem
        };

        this._onMenuChange = this._onMenuChange.bind(this);
    }

    _onMenuChange(e, object) {
        e.preventDefault();
        this.setState({
           activeItem: object.name
        });
        this.props.onMenuChange(object.name);
    }

    render() {

        return (
            <Menu>
                <Menu.Item
                    name='dashboard'
                    active={this.state.activeItem === 'dashboard'}
                    onClick={this._onMenuChange.bind(this)}>
                    Dashboard
                </Menu.Item>

                <Menu.Item
                    name='accounts'
                    active={this.state.activeItem === 'accounts'}
                    onClick={this._onMenuChange.bind(this)}>
                    Accounts
                </Menu.Item>

                <Menu.Item
                    name='goals'
                    active={this.state.activeItem === 'goals'}
                    onClick={this._onMenuChange.bind(this)}>
                    My Goals
                </Menu.Item>
            </Menu>
        )
    }
}

export default AppMenu;