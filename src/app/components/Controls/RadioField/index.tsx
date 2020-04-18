import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { WithStyles } from '@material-ui/styles/withStyles';
import withStyles from '@material-ui/styles/withStyles';
import createStyles from '@material-ui/styles/createStyles';
import React, { Component } from 'react';

interface OptionProps {
    label?: string;
    value?: any;
}

interface RadioProps<T> {
    md?: any;
    xs?: any;
    onChange?: (event: any) => void;
    name?: string;
    label?: string;
    value?: T | any;
    options?: (T & OptionProps)[];
}

type Props<T> = RadioProps<T> & WithStyles<any>;

const styles = (theme) => createStyles({
    radioGroup: {
        flexDirection: "initial"
    },
    radioItem: {
        color: "#fff"
    }

});

class RadioField<T> extends Component<Props<T>, any> {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }
    componentDidMount() {
        if (this.props.value)
            this.setState({ value: this.props.value })
    }
    render() {
        const { md, xs, label, value, onChange, name, options, ...others } = this.props;
        return (
            <Grid item md={md || 6} xs={xs || 12}>
                {/* <TextComponent
                    fullWidth
                    margin='dense'
                    variant='standard'
                    {...others}
                /> */}

                <FormLabel component="legend">{label}</FormLabel>
                {options ?
                    <RadioGroup className={this.props.classes.radioGroup} name={name} value={this.state.value}
                        onChange={(event) => {
                            const stateValue = event.target.value;
                            this.setState({ value: stateValue }, () => {
                                if (onChange) {
                                    onChange({
                                        target: {
                                            value: stateValue,
                                            name: name
                                        },
                                    });
                                }
                            })

                        }}>
                        {options.map((item, index) =>
                            <FormControlLabel
                                className={this.props.classes.radioItem}
                                key={index}
                                checked={value != null ? value == item.value : false}
                                value={item.value}
                                control={<Radio />}
                                label={item.label} />)}
                    </RadioGroup> : null}
            </Grid>
        )
    }
}

export default withStyles(styles)(RadioField);
