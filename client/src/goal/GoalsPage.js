import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import GenericForm from '../main/GenericForm';
import update from 'immutability-helper';
import _ from 'lodash';
import {Message} from 'semantic-ui-react';

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

    resetState(goals) {
        this.setState({
            goals: goals ? goals : this.state.goals,
            showForm: false,
            selectedGoal: {
                label: '',
                cost: 0,
                date: '',
                id: -1
            }
        });
    }

    _saveGoal(goal) {
        if (goal.id === -1) {
            Client.addGoal(goal, (savedGoal) => {
                this.resetState(update(this.state.goals, {$push: [savedGoal]}));
            });
        } else {
            Client.editGoal(goal, (savedGoal) => {
                let goalIdx = _.findIndex(this.state.goals, (a) => {
                    return a.id === savedGoal.id
                });
                this.resetState(update(this.state.goals, {[goalIdx]: {$set: savedGoal}}));
            });
        }
    }

    _updateGoal(event) {
        this.setState({
            selectedGoal: update(this.state.selectedGoal, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
    }

    _editGoal(goal) {
        this.setState({
            selectedGoal: goal,
            showForm: true
        });
    };

    _deleteGoal(goal) {
        Client.deleteGoal(goal.id);
        let goalIdx = _.findIndex(this.state.goals, (g) => {
            return g.id === goal.id
        });
        this.resetState(update(this.state.goals, {$splice: [[goalIdx, 1]]}));
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        if (!this.state.showForm) {
            const headers = [
                {key: 'id', value: 'Id'},
                {key: 'label', value: 'Label'},
                {key: 'cost', value: 'Cost'},
                {key: 'date', value: 'Due Date'}
            ];
            return (
                <SortableTable
                    editCallback={this._editGoal}
                    addNewCallback={() => this.setState({showForm: true})}
                    headers={headers}
                    items={this.state.goals}/>
            )
        } else {
            return (
                <div>
                    <Message
                        attached={true}
                        header='Add/Edit a goal'
                        content='Fill out the form below to add/edit a new goal'
                    />
                    <GenericForm
                        fields={[
                            {key: 'label', value: 'Label'},
                            {key: 'cost', value: 'Cost'},
                            {key: 'date', value: 'Due Date'}
                        ]}
                        item={this.state.selectedGoal}
                        submitCallback={this._saveGoal}
                        cancelCallback={() => this.resetState()}
                        deleteCallback={this._deleteGoal}
                        editing={this.state.selectedGoal.id !== -1}
                    />
                </div>
            )
        }
    }
}

export default GoalsPage;