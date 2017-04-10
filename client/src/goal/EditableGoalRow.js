import React from "react";
import {formatInput, formatValue, getInputType} from "../utils";
import {Button, Dropdown, Input, Table} from "semantic-ui-react";
import update from "immutability-helper";

class EditableGoalRow extends React.Component {

    constructor(props) {
        super();
        this.state = {
            editing: props.editing,
            goal: props.goal,
            categories: props.categories
        };

        this._startEditItem = this._startEditItem.bind(this);
        this._stopEditItem = this._stopEditItem.bind(this);
        this._updateItem = this._updateItem.bind(this);
        this._saveItem = this._saveItem.bind(this);
        this._addCategory = this._addCategory.bind(this);
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

    _updateItem(event, {name, value}) {
        event.preventDefault();
        let goalKey = name ? name : event.target.name;
        let goalValue = value ? value : event.target.value;
        this.setState({
            goal: update(this.state.goal, {
                $merge: {[goalKey]: goalValue}
            })
        });
    }

    _addCategory(e, {value}){
        e.preventDefault();
        let newCategories = this.state.categories;
        newCategories.push(value);
        this.setState({
            categories: newCategories
        });
    }

    _goalMapper = (goal, h, idx) => {
        if (this.state.editing) {
            let input;
            if (h.key === 'category') {
                let opt = this.state.categories.map((c, idx) => {
                    return {key: `${c}_${idx}`, value: c, text: c}
                });
                input = <Dropdown fluid search selection
                                  size="small"
                                  placeholder='Category'
                                  allowAdditions={true}
                                  name='category'
                                  onAddItem={this._addCategory}
                                  onChange={this._updateItem}
                                  options={opt}/>;
            } else {
                input = <Input
                    size="small"
                    fluid
                    type={getInputType(h.key)}
                    onChange={this._updateItem}
                    name={h.key}
                    value={formatInput(this.state.goal[h.key], h.key)}/>
            }
            return (
                <Table.Cell key={idx}>
                    {input}
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
    categories: React.PropTypes.array,
    editing: React.PropTypes.bool,
    saveCallback: React.PropTypes.func,
    deleteCallback: React.PropTypes.func,
    undoCallback: React.PropTypes.func
};
EditableGoalRow.defaultProps = {
    goalKeys: [],
    goal: {},
    categories: [],
    editing: false,
    deleteCallback: () => {
    },
    saveCallback: () => {
    },
    undoCallback: () => {
    }
};

export default EditableGoalRow;