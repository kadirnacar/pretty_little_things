import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { Component } from 'react';
import moment from 'moment';

class DateField extends Component<any, any> {
    render() {
        const { md, xs, onChange, value, name, ...others } = this.props;
        return (
            <Grid item md={md || 6} xs={xs || 12}>
                <KeyboardDatePicker
                    fullWidth
                    // disableToolbar
                    variant="inline"
                    format="DD.MM.YYYY"
                    margin="dense"
                    autoOk
                    onChange={(date, dateString) => {
                        onChange({
                            target: {
                                name: name,
                                value: moment(date).toISOString()
                            }
                        })
                    }}
                    value={value}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    {...others} />
            </Grid>
        )
    }
}

export default DateField
