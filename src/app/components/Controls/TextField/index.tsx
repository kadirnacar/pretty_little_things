import React, { Component } from 'react'
import { default as TextComponent, TextFieldProps } from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

interface TextProps {
    md?: any;
    xs?: any;
    onChange?: (event: any) => void;
    name?: string;
    label?: string;
}
type Props = TextProps & TextFieldProps

class TextField extends Component<Props, any> {
    render() {
        const { md, xs, ...others } = this.props;
        return (
            <Grid item md={md || 6} xs={xs || 12}>
                <TextComponent
                    fullWidth
                    
                    margin='dense'
                    variant='standard'
                    {...others}
                />
            </Grid>
        )
    }
}

export default TextField
