import React from 'react'
import {Menu} from 'semantic-ui-react'

class AppMenu extends React.Component {
    state = {};

    // handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.state;

        return (
            <Menu>
                <Menu.Item
                    name='dashboard'
                    active={activeItem === 'dashboard'}
                    onClick={this.props.onMenuChange}
                >
                    Dashboard
                </Menu.Item>

                <Menu.Item
                    name='accounts'
                    active={activeItem === 'accounts'}
                    onClick={this.props.onMenuChange}
                >
                    Accounts
                </Menu.Item>

                <Menu.Item
                    name='goals'
                    active={activeItem === 'goals'}
                    onClick={this.props.onMenuChange}
                >
                    My Goals
                </Menu.Item>
            </Menu>
        )
    }
}

export default AppMenu;