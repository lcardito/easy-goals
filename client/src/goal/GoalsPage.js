import React from "react";
import Client from "../main/Client";
import {Button, Confirm, Header, Icon, Table} from "semantic-ui-react";
import update from "immutability-helper";
import _ from "lodash";
import moment from "moment";
import EditableGoalRow from "./EditableGoalRow";

class GoalsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            goals: [],
            deleting: false,
            sortingBy: ''
        };

        this.headers = [
            {key: 'label', value: 'Label'},
            {key: 'amount', value: 'Cost'},
            {key: 'category', value: 'Category'},
            {key: 'dueDate', value: 'Due Date'}
        ];

        this._getGoals = this._getGoals.bind(this);
        this._saveGoal = this._saveGoal.bind(this);
        this._deleteGoal = this._deleteGoal.bind(this);
        this._exitEditItem = this._exitEditItem.bind(this);
        this._addNewGoal = this._addNewGoal.bind(this);
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

    _sortBy(prop) {
        this.sortingOrder = (this.sortingOrder === 'asc') ? 'desc' : 'asc';
        this.setState({
            goals: _.orderBy(this.state.goals, [prop], [this.sortingOrder]),
            sortingBy: prop
        })
    }

    _deleteGoal(goal) {
        if (this.state.deleting) {
            Client.deleteGoal(this.toBeDeleted.id);
            let idx = _.findIndex(this.state.goals, ['id', this.toBeDeleted.id]);
            this.setState({
                goals: update(this.state.goals, {
                    $splice: [[idx, 1]]
                }),
                deleting: false
            });
        } else {
            this.toBeDeleted = goal;
            this.setState({deleting: true});
        }
    };

    _saveGoal(goal) {
        let idx = _.findIndex(this.state.goals, goal);

        if (!goal.id) {
            Client.addGoal(goal, (newGoal) => {
                let goals = this.state.goals;
                this.setState({
                    goals: update(goals, {
                        $splice: [[idx, 1, newGoal[0]]]
                    })
                })
            });
        } else {
            Client.editGoal(goal, (updatedGoals) => {
                let goals = this.state.goals;
                this.setState({
                    goals: update(goals, {
                        $splice: [[idx, 1, updatedGoals[0]]]
                    })
                });
            });
        }
    };

    _exitEditItem(item) {
        if (!item.id) {
            this.setState({
                goals: update(this.state.goals, {
                    $splice: [[this.state.goals.length - 1, 1]]
                })
            });
        }
    }

    _addNewGoal() {
        if (this.state.goals.length === 0 || _.last(this.state.goals).id) {
            let goals = this.state.goals;
            this.setState({
                goals: update(goals, {
                    $push: [{
                        label: '',
                        amount: 0,
                        category: '',
                        dueDate: moment().format('YYYY-MM-DD')
                    }]
                })
            });
        }
    }

    _headerMapper = (h, idx) => {
        let iconName = 'sort';
        if (this.state.sortingBy === h.key) {
            iconName = this.sortingOrder === 'asc' ? 'sort ascending' : 'sort descending'
        }

        return (
            <Table.HeaderCell key={idx} onClick={() => this._sortBy(h.key)}>
                <Icon name={iconName}/> {h.value}
            </Table.HeaderCell>
        )
    };

    render() {
        return (
            <div>
                <Header as='h2'>
                    <Icon name='target'/>
                    <Header.Content>
                        This are your personal goals
                        <Header.Subheader>
                            These are your goals. You are in control of them. Add, edit or delete one of them.
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Table celled padded sortable striped unstackable selectable>
                    <Table.Header>
                        <Table.Row>
                            {this.headers.map((h, idx) => {
                                return this._headerMapper(h, idx);
                            })}
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.goals.map((goal, itemIdx) => (
                            <EditableGoalRow
                                key={itemIdx}
                                editing={!goal.id}
                                goal={goal}
                                goalKeys={this.headers}
                                saveCallback={this._saveGoal}
                                undoCallback={this._exitEditItem}
                                deleteCallback={this._deleteGoal}
                                categories={_.uniq(this.state.goals.map((g) => {return g.category})).filter((c) => c !== '')}
                            />
                        ))}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan={this.headers.length + 1}>
                                <Button
                                    onClick={this._addNewGoal}
                                    floated='left'
                                    icon
                                    size='tiny'
                                    labelPosition='left'
                                    primary>
                                    <Icon name="add circle"/>Add New
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <Confirm
                    open={this.state.deleting}
                    header='This operation can NOT be reverted'
                    content='Are you sure you want to delete this?'
                    onCancel={() => this.setState({deleting: false})}
                    onConfirm={() => this._deleteGoal()}
                />
            </div>
        )
    }
}

export default GoalsPage;