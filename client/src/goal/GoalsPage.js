import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import {Message, Table} from "semantic-ui-react";
import {formatValue} from "../utils";

class GoalsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            goals: [],
            selectedGoal: {
                label: '',
                amount: 0,
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
        const itemMapper = (item, h, idx) => {
            return <Table.Cell key={idx}>
                {formatValue(item[h.key], h.key)}
            </Table.Cell>
        };
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
                        {key: 'amount', value: 'Cost'},
                        {key: 'dueDate', value: 'Due Date'}
                    ]}
                    itemMapper={itemMapper}
                    items={this.state.goals}
                    editable={true}
                />
            </div>
        )
    }
}

export default GoalsPage;