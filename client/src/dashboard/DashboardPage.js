import React from 'react';
import SortableTable from '../main/SortableTable';

class DashboardPage extends React.Component {

    constructor() {
        super();
        this.state = {
            monthly: []
        };

    }

    componentWillMount() {
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