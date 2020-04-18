import { GridTable, NumberField } from "@components";
import { Grid, Paper, Slider } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

type Props = ApplicationState;

class Home extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      xSize: 50,
      ySize: 50,
      color: "#ffffff",
      scale: 1,
      xSize_temp: 50,
      ySize_temp: 50,
      scale_temp: 1,
    }
  }
  render() {
    return (
      <Grid container spacing={3} style={{ height: "100%" }}>
        <Grid item xs={4} style={{ height: "100%" }}>
          <Paper>
            <Grid container style={{ padding: 10, width: "100%", backgroundColor: "#303030", margin: 0 }} spacing={3}>
              <NumberField
                value={this.state.xSize_temp}
                label='Genişlik'
                onChange={(event) => {
                  if (event.target.value <= 200 || !event.target.value)
                    this.setState({ xSize_temp: event.target.value });
                  else
                    this.setState({})
                }}
              />
              <NumberField
                value={this.state.ySize_temp}
                label='Yükseklik'
                onChange={(event) => {
                  if (event.target.value <= 200 || !event.target.value)
                    this.setState({ ySize_temp: event.target.value });
                  else
                    this.setState({})
                }}
              />
              <Slider
                value={this.state.scale_temp}
                step={0.1}
                valueLabelDisplay="auto"
                marks={true}
                max={2}
                min={0.5}
                onChange={(e, newValue) => {
                  this.setState({ scale_temp: newValue })
                }} />

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={async () => {
                    this.setState({
                      xSize: this.state.xSize_temp,
                      ySize: this.state.ySize_temp,
                      scale: this.state.scale_temp,
                    })
                  }}>Uygula</Button>
              </Grid>
              <Grid item xs={12}>
                <IconButton
                  onClick={() => {
                    this.setState({ color: "#cccccc" })
                  }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.setState({ color: "#ffffff" })
                  }}>
                  <FiberManualRecordIcon htmlColor={"#ffffff"}/>
                </IconButton>
                <IconButton
                  onClick={() => {
                    this.setState({ color: "#ff0000" })
                  }}>
                  <FiberManualRecordIcon htmlColor={"#ff0000"} />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8} style={{ height: "100%" }}>
          <Paper style={{ overflow: "auto", height: "100%", position: "relative" }}>
            <GridTable
              color={this.state.color}
              ySize={this.state.ySize}
              xSize={this.state.xSize}
              scale={this.state.scale}
              cellSize={30} />
          </Paper>
        </Grid>
      </Grid>

    );
  }
}
// export default Home;

export const component = connect(
  (state: ApplicationState) => state,
  dispatch => {
    return {};
    // return { ChannelActions: bindActionCreators({ ...ChannelActions }, dispatch) };
  }
)(Home as any);
