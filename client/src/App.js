import React from "react";
import AppMenu from "./AppMenu";
import TableAccordion from "./TableAccordion";

class App extends React.Component {

    constructor(){
        super();
        this.state = {
            activeItem: "accounts"
        };
    }

    handleMenuItemClick = (name) => this.setState({activeItem: name});

    render() {
        return (
            <div className='App'>
                <div className='ui container'>
                    <AppMenu
                        initialActiveItem={this.state.activeItem}
                        onMenuChange={this.handleMenuItemClick} />
                    <TableAccordion
                        visible={this.state.activeItem === 'accounts'}
                    />
                </div>
            </div>
        );
    }
}

export default App;
