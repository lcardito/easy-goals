import React from "react";
import AppMenu from "./AppMenu";
import AccountBox from "./AccountBox";

class App extends React.Component {

    constructor(){
        super();
        this.state = {
            activeItem: "dashboard"
        };
    }

    handleMenuItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        return (
            <div className='App'>
                <div className='ui container'>
                    <AppMenu onMenuChange={this.handleMenuItemClick} />
                    <AccountBox visible={this.state.activeItem === 'accounts'} />
                </div>
            </div>
        );
    }
}

export default App;
