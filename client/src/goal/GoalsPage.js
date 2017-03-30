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
                category: '',
                dueDate: ''
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
                category: '',
                dueDate: ''
            }
        });
    }

    _saveGoal(goal) {
        if (!goal.id) {
            Client.addGoal(goal, (savedGoal) => {
                this.resetState(update(this.state.goals, {$push: [savedGoal[0]]}));
            });
        } else {
            Client.editGoal(goal, (savedGoals) => {
                let savedGoal = savedGoals[0];
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
        if (!this.state.showForm) {
            const headers = [
                {key: 'label', value: 'Label'},
                {key: 'category', value: 'Category'},
                {key: 'cost', value: 'Cost'},
                {key: 'dueDate', value: 'Due Date'}
            ];
            return (
                <SortableTable
                    editCallback={this._editGoal}
                    addNewCallback={() => this.setState({showForm: true})}
                    headers={headers}
                    items={this.state.goals}
                    editable={true}
                    detailPath="goals"
                />
            )
        } else {
            return (
                <div>
                    <Message
                        header='Add/Edit a goal'
                        content='Fill out the form below to add/edit a new goal'
                    />
                    <GenericForm
                        fields={[
                            {key: 'label', value: 'Label'},
                            {key: 'category', value: 'Category'},
                            {key: 'cost', value: 'Cost'},
                            {key: 'dueDate', value: 'Due Date'}
                        ]}
                        item={this.state.selectedGoal}
                        submitCallback={this._saveGoal}
                        cancelCallback={() => this.resetState()}
                        deleteCallback={this._deleteGoal}
                        editing={this.state.selectedGoal.id}
                    />
                </div>
            )
        }
    }
}

export default GoalsPage;

GoalsPage.propTypes = {
    visible: React.PropTypes.bool
};

GoalsPage.defaultProps = {
    visible: false
};