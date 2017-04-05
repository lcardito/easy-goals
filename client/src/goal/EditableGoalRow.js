import React from "react";
import {formatInput, formatValue, getInputType} from "../utils";
import {Button, Input, Table} from "semantic-ui-react";
import update from "immutability-helper";

class EditableGoalRow extends React.Component {

    constructor(props){
        super();
        this.state = {
            editing: props.editing,
            goal: props.goal
        };

        this._startEditItem = this._startEditItem.bind(this);
        this._stopEditItem = this._stopEditItem.bind(this);
        this._updateItem = this._updateItem.bind(this);
        this._saveItem = this._saveItem.bind(this);
    }

    _startEditItem() {
        this.setState({
            editing: true
        });
    };

    _stopEditItem() {
        this.setState({
            editing: false
        });

        this.props.undoCallback(this.state.goal);
    }

    _saveItem() {
        this.setState({
            editing: false
        });
        this.props.saveCallback(this.state.goal);
    }

    _updateItem(event) {
        event.preventDefault();
        this.setState({
            goal: update(this.state.goal, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
    }


    _goalMapper = (goal, h, idx) => {
        if (this.state.editing) {
            return (
                <Table.Cell key={idx}>
                    <Input
                        fluid
                        type={getInputType(h.key)}
                        onChange={this._updateItem}
                        name={h.key}
                        value={formatInput(this.state.goal[h.key], h.key)}/>
                </Table.Cell>
            )
        } else {
            return (
                <Table.Cell key={idx}>
                    {formatValue(goal[h.key], h.key)}
                </Table.Cell>
            )
        }
    };


    render() {
        return <Table.Row>
            {this.props.goalKeys.map((h, idx) => {
                return this._goalMapper(this.props.goal, h, idx);
            })}
            <Table.Cell collapsing textAlign="center">
                {!this.state.editing &&
                <Button.Group size="mini" basic compact>
                    <Button color="blue" icon="edit" onClick={this._startEditItem}/>
                    <Button negative icon="delete" onClick={() => {
                        this.props.deleteCallback(this.state.goal)
                    }}/>
                </Button.Group>
                }
                {this.state.editing &&
                <Button.Group size="mini" basic compact>
                    <Button icon="step backward" onClick={this._stopEditItem}/>
                    <Button icon='save' color="blue" onClick={this._saveItem}/>
                </Button.Group>
                }
            </Table.Cell>
        </Table.Row>
    }
}

EditableGoalRow.propTypes = {
    goalKeys: React.PropTypes.array,
    goal: React.PropTypes.object,
    editing: React.PropTypes.bool,
    saveCallback: React.PropTypes.func,
    deleteCallback: React.PropTypes.func,
    undoCallback: React.PropTypes.func
};
EditableGoalRow.defaultProps = {
    goalKeys: [],
    goal: {},
    editing: false,
    deleteCallback: () => {},
    saveCallback: () => {},
    undoCallback: () => {}
};

export default EditableGoalRow;