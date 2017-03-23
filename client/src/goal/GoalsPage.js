import React from 'react';
import {Table} from 'semantic-ui-react';
import Client from '../main/Client';

class GoalsPage extends React.Component {

    constructor() {
        super();

        this.state = {
            goals: []
        };
    }

    componentWillMount() {
        Client.getGoals((serverGoals) => (
            this.setState({
                goals: serverGoals
            })
        ));
    }

    render() {
        if (!this.props.visible) {
            return false;
        }
        return (
            <Table celled
                   padded
                   sortable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Cost</Table.HeaderCell>
                        <Table.HeaderCell>Due date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.state.goals.map((goal, idx) => (
                        <Table.Row
                            key={idx}>
                            <Table.Cell>
                                {goal.name}
                            </Table.Cell>
                            <Table.Cell>
                                {goal.cost}
                            </Table.Cell>
                            <Table.Cell>
                                {goal.dueDate}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }
}

export default GoalsPage;