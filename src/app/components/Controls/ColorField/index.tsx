import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import zIndex from '@material-ui/core/styles/zIndex';

interface ColorProps {
    md?: any;
    xs?: any;
    onChange?: (event: any) => void;
    name?: string;
    label?: string;
    value?: string;
}
type Props = ColorProps

class ColorField extends Component<Props, any> {
    constructor(props) {
        super(props);
        this.state = { show: false }
    }
    render() {
        const { md, xs, value, label, onChange, ...others } = this.props;
        return (
            <Grid item md={md || 6} xs={xs || 12}>
                <Button
                    variant="contained"
                    style={{ backgroundColor: value }}
                    onClick={async () => {
                        this.setState({ show: true })
                    }}>{label}</Button>
                {this.state.show ?
                    <div
                        style={{
                            position: 'absolute',
                            zIndex: 2,
                        }}>

                        <ChromePicker
                            color={value}
                            onChange={(color) => {
                                onChange({
                                    target: {
                                        value: color,
                                        name: name
                                    },
                                });
                            }} />
                        <Button
                            color="secondary"
                            style={{ position: "absolute", bottom: 0, borderRadius: 0, height: 33, width: "100%" }}
                            variant="contained"
                            onClick={async () => {
                                this.setState({ show: false })
                            }}>Tamam</Button>
                    </div>
                    : null}
            </Grid>
        )
    }
}

export default ColorField
