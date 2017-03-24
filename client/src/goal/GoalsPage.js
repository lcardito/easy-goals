import React from 'react';
import Client from '../main/Client';
import GoalTable from '../goal/GoalTable';
import {Form, Button} from 'semantic-ui-react'
import update from 'immutability-helper';

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
    }

    componentWillMount() {
        Client.getGoals((serverGoals) => {
            this._getGoals(serverGoals);
        })
    }

    _getGoals(serverGoals){
        this.setState({
            goals: serverGoals
        });
    }

    _saveGoal(e) {
        e.preventDefault();
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
    }

    _updateGoal(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newGoal = update(this.state.selectedGoal, {$merge: {[name]: value}});

        this.setState({
            selectedGoal: newGoal
        });
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        if (!this.state.showForm) {
            return <div>
                <GoalTable goals={this.state.goals}/>
                <Button type="button" onClick={() => this.setState({showForm: true})}>Add new Goal</Button>
            </div>
        } else {
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
                    </Form.Group>
                </Form>
            )
        }
    }
}

export default GoalsPage;