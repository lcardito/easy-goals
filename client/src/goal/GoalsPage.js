import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import {Message} from "semantic-ui-react";

class GoalsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            goals: [],
            selectedGoal: {
                label: '',
                cost: 0,
                category: '',
                dueDate: ''
            }
        };

        this._getGoals = this._getGoals.bind(this);
    }

    componentWillMount() {
        Client.getGoals((serverGoals) => {
            this._getGoals(serverGoals);
        })
    }

    _getGoals(serverGoals) {
        this.setState({
            goals: serverGoals
        });
    }

    render() {
        return (
            <div>
                <Message
                    header='Goals'
                    content='These are your goals. You are in control of them. Add, edit or delete one of them.'
                />
                <SortableTable
                    detailPath="goals"
                    headers={[
                        {key: 'label', value: 'Label'},
                        {key: 'category', value: 'Category'},
                        {key: 'cost', value: 'Cost'},
                        {key: 'dueDate', value: 'Due Date'}
                    ]}
                    items={this.state.goals}
                    editable={true}
                />
            </div>
        )
    }
}

export default GoalsPage;