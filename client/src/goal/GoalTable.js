import React from 'react'
import {Table} from 'semantic-ui-react';
import _ from 'lodash';

class GoalTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            goals: props.goals
        };

        this._sortBy = this._sortBy.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            goals: nextProps.goals
        })
    }

    _sortBy(prop) {
        this.sortingOrder = (this.sortingOrder === 'asc') ? 'desc' : 'asc';
        this.setState({
            goals: _.orderBy(this.state.goals, [prop], [this.sortingOrder])
        })
    }

    render() {
        return (
            <Table celled
                   padded
                   sortable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            onClick={() => this._sortBy('label')}>Name</Table.HeaderCell>
                        <Table.HeaderCell
                            onClick={() => this._sortBy('cost')}>Cost</Table.HeaderCell>
                        <Table.HeaderCell
                            onClick={() => this._sortBy('date')}>Due date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.state.goals.map((goal, idx) => (
                        <Table.Row
                            key={idx}>
                            <Table.Cell>
                                {goal.label}
                            </Table.Cell>
                            <Table.Cell>
                                {goal.cost}
                            </Table.Cell>
                            <Table.Cell>
                                {goal.date}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }
}

export default GoalTable;