import React from "react";
import AppMenu from "./AppMenu";
import BucketsPage from "../account/BucketsPage";
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
                    <AppMenu initialActiveItem={this.state.activeItem} onMenuChange={this.handleMenuItemClick}/>
                    <BucketsPage visible={this.state.activeItem === 'buckets'}/>
                    <GoalsPage visible={this.state.activeItem === 'goals'}/>
                </div>
            </div>
        );
    }
}

export default App;
