import React from 'react';
import SortableTable from '../main/SortableTable';
import Client from '../main/Client';

class DashboardPage extends React.Component {

    constructor() {
        super();
        this.state = {
            monthly: []
        };

        this._getMonthly = this._getMonthly.bind(this);
    }

    componentWillMount() {
        Client.getMonthly((serverMonthly) => {
            this._getMonthly(serverMonthly);
        })
    }

    _getMonthly(serverMonthly) {
        this.setState({
            monthly: serverMonthly
        });
    }

    render() {
        if (!this.props.visible) {
            return null;
        }
        return (
            <SortableTable
                headers={[
                    {key: 'category', value: 'Goal category'},
                    {key: 'balance', value: 'Bucket Balance'},
                    {key: 'monthly', value: 'Due Monthly Saving'}
                ]}
                items={this.state.monthly}
                editable={false}
            />
        )
    }
}

export default DashboardPage;