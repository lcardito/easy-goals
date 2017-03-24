import React from 'react';
import SortableTable from '../main/SortableTable';

class DashboardPage extends React.Component {
    render() {
        if (!this.props.visible) {
            return null;
        }
        return (
            <SortableTable
                headers={[
                    {key: 'category', value: 'Goal category'},
                    {key: 'balance', value: 'Account Balance'},
                    {key: 'monthly', value: 'Due Monthly Saving'}
                ]}
                editable={false}
            />
        )
    }
}

export default DashboardPage;