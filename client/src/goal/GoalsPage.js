import React from 'react';
import Client from '../main/Client';
import GoalTable from '../goal/GoalTable';
import {Form} from 'semantic-ui-react'
import update from 'immutability-helper';
import _ from 'lodash';

class GoalsPage extends React.Component {

    constructor() {
        super();

        this.state = {
            goals: [],
            showForm: false,
            selectedGoal: {
                label: '',
                cost: 0,
                date: '',
                id: -1
            }
        };

        this._getGoals = this._getGoals.bind(this);
        this._saveGoal = this._saveGoal.bind(this);
        this._updateGoal = this._updateGoal.bind(this);
        this._editGoal = this._editGoal.bind(this);
        this._deleteGoal = this._deleteGoal.bind(this);
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

    _saveGoal(e) {
        e.preventDefault();
        if (this.state.selectedGoal.id === -1) {
            Client.addGoal(this.state.selectedGoal, (savedGoal) => {
                this.setState({
                    goals: update(this.state.goals, {$push: [savedGoal]}),
                    showForm: false,
                    selectedGoal: {
                        label: '',
                        cost: 0,
                        date: '',
                        id: -1
                    }
                });
            });
        } else {
            Client.editGoal(this.state.selectedGoal, (savedGoal) => {
                let goalIdx = _.findIndex(this.state.goals, (a) => {
                    return a.id === savedGoal.id
                });
                this.setState({
                    goals: update(this.state.goals, {[goalIdx]: {$set: savedGoal}}),
                    showForm: false,
                    selectedGoal: {
                        label: '',
                        cost: 0,
                        date: '',
                        id: -1
                    }
                });
            });
        }
    }

    _updateGoal(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newGoal = update(this.state.selectedGoal, {$merge: {[name]: value}});

        this.setState({
            selectedGoal: newGoal
        });
    }

    _editGoal(goal) {
        this.setState({
            selectedGoal: goal,
            showForm: true
        });
    };

    _deleteGoal() {
        Client.deleteGoal(this.state.selectedGoal.id);

        let goalIdx = _.findIndex(this.state.goals, (g) => {
            return g.id === this.state.selectedGoal.id
        });

        this.setState({
            goals: update(this.state.goals, {$splice: [[goalIdx, 1]]}),
            showForm: false
        })
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        if (!this.state.showForm) {
            return <div>
                <GoalTable
                    editCallback={this._editGoal}
                    addNewCallback={() => this.setState({showForm: true})}
                    goals={this.state.goals}/>
            </div>
        } else {
            let deleteButton = null;
            if(this.state.selectedGoal.id !== -1) {
                deleteButton = <Form.Button
                    type="button"
                    onClick={this._deleteGoal}
                    color="red">Delete</Form.Button>
            }
            return (
                <Form onSubmit={this._saveGoal.bind(this)}>
                    <Form.Group inline>
                        <Form.Input label='Label'
                                    name="label"
                                    value={this.state.selectedGoal.label}
                                    onChange={this._updateGoal}
                                    placeholder='What are you saving for?'/>
                        <Form.Input label='Cost'
                                    name="cost"
                                    value={this.state.selectedGoal.cost}
                                    onChange={this._updateGoal}
                                    placeholder='How much will it cost?'/>
                        <Form.Input type="date"
                                    name="date"
                                    label='Due date'
                                    value={this.state.selectedGoal.date}
                                    onChange={this._updateGoal}
                                    placeholder='When?'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Button color="green" type="submit">Save</Form.Button>
                        <Form.Button type="button"
                                     onClick={() => this.setState({showForm: false})}>Cancel</Form.Button>
                        {deleteButton}
                    </Form.Group>
                </Form>
            )
        }
    }
}

export default GoalsPage;