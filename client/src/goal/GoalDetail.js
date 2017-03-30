import React from 'react';
import {Message} from "semantic-ui-react";
import GenericForm from "../main/GenericForm";
import Client from "../main/Client";
import * as _ from "lodash";

class GoalDetail extends React.Component {

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            selectedGoal: {
                label: '',
                category: '',
                cost: 0,
                dueDate: ''
            }
        };

        this._saveGoal = this._saveGoal.bind(this);
        this._deleteGoal = this._deleteGoal.bind(this);
    }

    componentWillMount() {
        if(!isNaN(this.props.params.goalId)) {
            Client.getGoals((serverGoals) => {
                this.setState({
                    selectedGoal: _.find(serverGoals, _.matchesProperty('id', parseInt(this.props.params.goalId, 10)))
                })
            })
        }

    }

    _deleteGoal(goal) {
        Client.deleteGoal(goal.id);
        this.context.router.goBack();
    }

    _saveGoal(goal) {
        if (!goal.id) {
            Client.addGoal(goal, () => {
                this.context.router.goBack();
            });
        } else {
            Client.editGoal(goal, () => {
                this.context.router.goBack()
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
                editing={true}
                submitCallback={this._saveGoal}
                deleteCallback={this._deleteGoal}
            />
        </div>
    }
}

export default GoalDetail;

GoalDetail.defaultProps = {
    params: {
        goalId: undefined
    }
};