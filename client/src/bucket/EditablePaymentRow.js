import React from 'react';
import {formatInput, formatValue, getInputType} from "../utils";
import {Table, Button, Input, Dropdown} from 'semantic-ui-react';
import update from "immutability-helper";

class EditablePaymentRow extends React.Component {

    constructor(props) {
        super();
        this.state = {
            editing: props.editing,
            payment: props.payment,
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

        this.props.undoCallback(this.state.payment);
    }

    _saveItem() {
        this.setState({
            editing: false
        });
        this.props.saveCallback(this.state.payment);
    }

    _updateItem(event, {name, value}) {
        event.preventDefault();
        let paymentKey = name ? name : event.target.name;
        let paymentValue = value ? value : event.target.value;
        this.setState({
            payment: update(this.state.payment, {
                $merge: {[paymentKey]: paymentValue}
            })
        });
    }

    _paymentMapper = (payment, h, idx) => {
        if (this.state.editing) {
            let input = null;
            if (h.key === 'type') {
                let opt = [{key: 'IN', value: 'IN', text: 'IN'}, {key: 'OUT', value: 'OUT', text: 'OUT'}];
                input = <Dropdown
                                  selection
                                  defaultValue={payment[h.key]}
                                  size="small"
                                  placeholder='Payment type'
                                  name='type'
                                  onChange={this._updateItem}
                                  options={opt}/>;
            } else {
                input = <Input
                    size="small"
                    type={getInputType(h.key)}
                    onChange={this._updateItem}
                    name={h.key}
                    value={formatInput(payment[h.key], h.key)}/>
            }
            return (
                <Table.Cell key={idx}>
                    {input}
                </Table.Cell>
            )
        } else {
            return (
                <Table.Cell key={idx}>
                    {formatValue(payment[h.key], h.key)}
                </Table.Cell>
            )
        }
    };


    render() {
        return <Table.Row>
            {this.props.paymentKeys.map((h, idx) => {
                return this._paymentMapper(this.props.payment, h, idx);
            })}
            <Table.Cell collapsing textAlign="center">
                {!this.state.editing &&
                <Button.Group size="mini" basic compact>
                    <Button color="blue" icon="edit" onClick={this._startEditItem}/>
                    <Button negative icon="delete" onClick={() => {
                        this.props.deleteCallback(this.state.payment)
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

EditablePaymentRow.propTypes = {
    paymentKeys: React.PropTypes.array,
    payment: React.PropTypes.object,
    editing: React.PropTypes.bool,
    saveCallback: React.PropTypes.func,
    deleteCallback: React.PropTypes.func,
    undoCallback: React.PropTypes.func
};
EditablePaymentRow.defaultProps = {
    paymentKeys: [],
    payment: {},
    editing: false,
    deleteCallback: () => {},
    saveCallback: () => {},
    undoCallback: () => {}
};

export default EditablePaymentRow;