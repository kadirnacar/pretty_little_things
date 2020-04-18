import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AutocompleteProps, RenderInputParams } from '@material-ui/lab/Autocomplete/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab/useAutocomplete';
import React, { Component } from 'react';

interface ComboProps<T> {
    md?: any;
    xs?: any;
    onChange?: (event: any) => void;
    name?: string;
    label?: string;
}
type KeysOfAutoComplete<T> = {
    [K in keyof AutocompleteProps<T>]?: AutocompleteProps<T>[K];
}
type Props<T> = ComboProps<T> & KeysOfAutoComplete<T> & UseAutocompleteProps<T>;

class ComboField<T> extends Component<Props<T>, any> {
    render() {
        const { md, xs, name, label, onChange, ...others } = this.props;
        return (
            <Grid item md={md || 6} xs={xs || 12}>
                <Autocomplete
                    {...others}
                    includeInputInList
                    onChange={(event, value) => {
                        onChange({
                            target: {
                                value: value,
                                name: name
                            },
                        });
                    }}
                    renderInput={params => {
                        return <TextField {...params}
                            name={name}
                            label={label}
                            fullWidth
                            margin='dense'
                            variant='standard' />
                    }}
                />
            </Grid>
        )
    }
}

export default ComboField
