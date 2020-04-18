import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CheckboxProps, default as Checkbox } from "@material-ui/core/Checkbox";

interface TextProps {
    md?: any;
    xs?: any;
    onChange?: (event: any) => void;
    name?: string;
    label?: string;
}
type Props = TextProps & CheckboxProps

class TextField extends Component<Props, any> {
    render() {
        const { md, xs, ...others } = this.props;
        return (
            <Grid item md={md || 6} xs={xs || 12}>
                <FormControlLabel
                    control={<Checkbox color="primary" {...others} />}
                    label={this.props.label}
                />
            </Grid>
        )
    }
}

export default TextField
