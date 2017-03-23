import React from 'react';
import {Grid, Segment} from 'semantic-ui-react';

class AccordionHeader extends React.Component {

    render() {
        return (
            <Segment textAlign="center"
                     className="segmentSmall textBold">
                <Grid columns={this.props.headers.length}>
                    {this.props.headers.map((title, idx) => (
                        <Grid.Column key={idx}>
                            <Segment basic>{title}</Segment>
                        </Grid.Column>
                    ))}
                </Grid>
            </Segment>
        );
    }
}

export default AccordionHeader;