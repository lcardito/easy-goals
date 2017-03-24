import React from "react";
import AppMenu from "./AppMenu";
import AccountsPage2 from "../account/AccountsPage";
import GoalsPage from '../goal/GoalsPage';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            activeItem: "goals"
        };
    }

    handleMenuItemClick = (name) => this.setState({activeItem: name});

    render() {
        return (
            <div className='App'>
                <div className='ui container'>
                    <AppMenu
                        initialActiveItem={this.state.activeItem}
                        onMenuChange={this.handleMenuItemClick}/>
                    <AccountsPage2
                        visible={this.state.activeItem === 'accounts'}
                    />
                    <GoalsPage
                        visible={this.state.activeItem === 'goals'}/>
                </div>
            </div>
        );
    }
}

export default App;
