import React, { Component } from 'react'
import NumberFormat from 'react-number-format';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const NumberFormatCustom = (props) => {
    const { inputRef, prefix, max, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.floatValue,
                        name: other.name
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix={prefix}
            max={max}
        />
    );
}

class NumberField extends Component<any, any> {
    
    render() {
        const { md, xs, InputProps, ...others } = this.props;
        const inputProps = {
            ...InputProps,
            inputComponent: NumberFormatCustom
        };
        return (
            // <Grid item md={md || 6} xs={xs || 12}>
            <TextField
                fullWidth
                
                margin='dense'
                variant='standard'
                {...others}
                InputProps={inputProps}
            />
            // </Grid >
        )
    }
}

export default NumberField
