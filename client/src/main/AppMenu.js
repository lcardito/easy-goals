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
                    name='goals'
                    active={this.state.activeItem === 'goals'}
                    onClick={this._onMenuChange.bind(this)}>
                    My Goals
                </Menu.Item>
                <Menu.Item
                    name='buckets'
                    active={this.state.activeItem === 'buckets'}
                    onClick={this._onMenuChange.bind(this)}>
                    Buckets
                </Menu.Item>
            </Menu>
        )
    }
}

export default AppMenu;