import React from "react";
import AppMenu from "./AppMenu";
import BucketsPage from "../account/BucketsPage";
import GoalsPage from '../goal/GoalsPage';
import DashboardPage from '../dashboard/DashboardPage';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            activeItem: "buckets"
        };
    }

    handleMenuItemClick = (name) => this.setState({activeItem: name});

    render() {
        return (
            <div className='App'>
                <div className='ui container'>
                    <AppMenu initialActiveItem={this.state.activeItem} onMenuChange={this.handleMenuItemClick}/>
                    <BucketsPage visible={this.state.activeItem === 'buckets'}/>
                    <GoalsPage visible={this.state.activeItem === 'goals'}/>
                    <DashboardPage visible={this.state.activeItem === 'dashboard'}/>
                </div>
            </div>
        );
    }
}

export default App;
