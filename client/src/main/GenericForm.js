import React from 'react';
import {Form, Confirm} from 'semantic-ui-react';
import update from 'immutability-helper';

class GenericForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: props.fields,
            item: props.item,
            editing: props.editing,
            confirmOpen: false
        };

        this._updateItem = this._updateItem.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fields: nextProps.fields,
            item: nextProps.item,
            editing: nextProps.editing
        })
    }

    _updateItem(event) {
        this.setState({
            item: update(this.state.item, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
    }

    _submitForm(e) {
        e.preventDefault();
        this.props.submitCallback(this.state.item);
    }

    render() {
        let deleteButton = null;
        if (this.state.editing) {
            deleteButton = <Form.Button
                type="button"
                onClick={() => this.setState({confirmOpen: true})}
                color="red">Delete</Form.Button>
        }
        return (
            <div>
                <Form
                    className='segment'
                    onSubmit={this._submitForm.bind(this)}>
                    <Form.Group widths='equal'>
                        {this.state.fields.map((field, idx) => (
                            <Form.Input
                                key={idx}
                                label={field.value}
                                name={field.key}
                                type={field.key === 'date' ? 'date' : 'text'}
                                value={this.state.item[field.key]}
                                onChange={this._updateItem}
                            />
                        ))}
                    </Form.Group>
                    <Form.Group>
                        <Form.Button color="green" type="submit">Save</Form.Button>
                        <Form.Button type="button"
                                     onClick={() => this.props.cancelCallback()}>Cancel</Form.Button>
                        {deleteButton}
                    </Form.Group>
                </Form>
                <Confirm
                    open={this.state.confirmOpen}
                    header='This operation can NOT be reverted'
                    content='Are you sure you want to delete this?'
                    onCancel={() => this.setState({confirmOpen: false})}
                    onConfirm={() => this.props.deleteCallback(this.state.item)}
                />
            </div>
        )
    }
}

export default GenericForm;