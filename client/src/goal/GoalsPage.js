import React from "react";
import Client from "../main/Client";
import {Button, Confirm, Header, Icon, Input, Table} from "semantic-ui-react";
import {formatInput, formatValue, getInputType} from "../utils";
import update from "immutability-helper";
import _ from "lodash";
import moment from "moment";

class GoalsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            goals: [],
            selectedGoal: {
                label: '',
                amount: 0,
                category: '',
                dueDate: moment().format('YYYY-MM-DD')
            },
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
        this._startEditItem = this._startEditItem.bind(this);
        this._updateGoal = this._updateGoal.bind(this);
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

    _updateGoal(event) {
        event.preventDefault();
        this.setState({
            selectedGoal: update(this.state.selectedGoal, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
    }

    _deleteGoal(goal){
        if(this.state.deleting) {
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

    _saveGoal(idx) {
        if (!this.state.selectedGoal.id) {
            Client.addGoal(this.state.selectedGoal, (newGoal) => {
                let goals = this.state.goals;
                this.setState({
                    goals: update(goals, {
                        $splice: [[idx, 1, newGoal[0]]]
                    })
                })
            });
        } else {
            Client.editGoal(this.state.selectedGoal, (updatedGoals) => {
                let goals = this.state.goals;
                this.setState({
                    goals: update(goals, {
                        $splice: [[idx, 1, updatedGoals[0]]]
                    })
                });
            });
        }
        this.setState({
            selectedGoal: {
                label: '',
                amount: 0,
                category: '',
                dueDate: moment().format('YYYY-MM-DD')
            }
        });
    };

    _startEditItem(idx) {
        this.setState({
            selectedGoal: this.state.goals[idx]
        });
    };

    _exitEditItem() {
        if(!this.state.selectedGoal.id){
            this.setState({
                goals: update(this.state.goals, {
                    $splice: [[this.state.goals.length - 1, 1]]
                })
            });
        }
        this.setState({
            selectedGoal: {}
        });
    }

    _addNewGoal() {
        if(_.last(this.state.goals).id) {
            let goals = this.state.goals;
            this.setState({
                goals: update(goals, {
                    $push: [this.state.selectedGoal]
                })
            });
        }
    }

    _itemMapper = (item, h, idx) => {
        if (this.state.selectedGoal.id === item.id) {
            return (
                <Table.Cell
                    key={idx}>
                    <Input
                        fluid
                        type={getInputType(h.key)}
                        onChange={this._updateGoal}
                        name={h.key}
                        value={formatInput(this.state.selectedGoal[h.key], h.key)}/>
                </Table.Cell>
            )
        } else {
            return (
                <Table.Cell
                    key={idx}>
                    {formatValue(item[h.key], h.key)}
                </Table.Cell>
            )
        }
    };

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
                        {this.state.goals.map((goal, itemIdx) => ([
                            <Table.Row
                                key={itemIdx}>
                                {this.headers.map((h, idx) => {
                                    return this._itemMapper(goal, h, idx);
                                })}
                                <Table.Cell collapsing textAlign="center">
                                    {this.state.selectedGoal.id !== goal.id &&
                                    <Button.Group size="mini" basic compact>
                                        <Button color="blue" icon="edit" onClick={() => this._startEditItem(itemIdx)}/>
                                        <Button negative icon="delete" onClick={() => {this._deleteGoal(goal)}}/>
                                    </Button.Group>
                                    }
                                    {this.state.selectedGoal.id === goal.id &&
                                    <Button.Group size="mini" basic compact>
                                        <Button icon="step backward" onClick={() => this._exitEditItem()}/>
                                        <Button icon='save' color="blue" onClick={() => this._saveGoal(itemIdx)}/>
                                    </Button.Group>
                                    }
                                </Table.Cell>
                            </Table.Row>
                        ]))}
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