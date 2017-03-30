import React from "react";
import {Link} from "react-router";
import {Menu} from "semantic-ui-react";

export default React.createClass({
    render() {
        return (
            <div className='ui container'>
                <Menu>
                    <Menu.Item
                        name='goals'>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item
                        name='goals'>
                        <Link to="/goals">Goals</Link>
                    </Menu.Item>
                    <Menu.Item
                        name='buckets'>
                        <Link to="/buckets">Buckets</Link>
                    </Menu.Item>
                </Menu>
                {this.props.children}
            </div>
        )
    }
})
