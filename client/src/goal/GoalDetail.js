import React from 'react';
import {Message} from "semantic-ui-react";
import GenericForm from "../main/GenericForm";
import Client from "../main/Client";
import * as _ from "lodash";

class GoalDetail extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedGoal: {
                label: '',
                category: '',
                cost: 0,
                dueDate: '2017-01-01'
            }
        };

        this._saveGoal = this._saveGoal.bind(this);
        this._deleteGoal = this._deleteGoal.bind(this);
    }

    componentWillMount() {
        Client.getGoals((serverGoals) => {
            this.setState({
                selectedGoal: _.find(serverGoals, _.matchesProperty('id', parseInt(this.props.params.goalId, 10)))
            })
        })
    }

    _deleteGoal(goal) {
        Client.deleteGoal(goal.id);
    }

    _saveGoal(goal) {
        if (!goal.id) {
            Client.addGoal(goal, (savedGoal) => {
                // this.resetState(update(this.state.goals, {$push: [savedGoal[0]]}));
            });
        } else {
            Client.editGoal(goal, (savedGoals) => {
                let savedGoal = savedGoals[0];
                let goalIdx = _.findIndex(this.state.goals, (a) => {
                    return a.id === savedGoal.id
                });
                // this.resetState(update(this.state.goals, {[goalIdx]: {$set: savedGoal}}));
            });
        }
    }

    render() {
        return <div>
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
                deleteCallback={this._deleteGoal}
            />
        </div>
    }
}

export default GoalDetail;