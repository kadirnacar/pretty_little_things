import { GridTable, NumberField } from "@components";
import { Grid, Paper, Slider } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { ColorActions } from "@reducers";
import { bindActionCreators } from "redux";
import { FileService } from "@services";

type Props = ApplicationState & { ColorActions: typeof ColorActions };

class Home extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    const size = 20;
    this.state = {
      xSize: size,
      ySize: size,
      color: "#ffffff",
      scale: 1,
      image: { path: null, data: null },
      xSize_temp: size,
      ySize_temp: size,
      scale_temp: 1,
    }
  }
  async  UNSAFE_componentWillMount() {
    await this.props.ColorActions.getList();
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
                min={0.1}
                onChange={(e, newValue) => {
                  this.setState({ scale_temp: newValue })
                }} />

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={async () => {
                    const result = await FileService.getList();
                    console.log(result)
                    if (!result.hasErrors())
                      this.setState({ image: result.value })
                  }}>Resim Yükle</Button>
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
                  style={{ border: this.state.color == "hide" ? "1px solid #fff" : "none" }}
                  onClick={() => {
                    this.setState({ color: "hide" })
                  }}>
                  <DeleteIcon />
                </IconButton>
                {this.props.Color.List.map((item, index) => {
                  return <IconButton
                    key={index}
                    style={{ border: this.state.color == item.code ? "1px solid #fff" : "none" }}
                    onClick={() => {
                      this.setState({ color: item.code })
                    }}>
                    <FiberManualRecordIcon htmlColor={item.code} />
                  </IconButton>
                })}

              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8} style={{ height: "100%" }}>
          <Paper style={{ overflow: "auto", height: "100%", position: "relative" }}>
            <GridTable
              image={this.state.image}
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
    return { ColorActions: bindActionCreators({ ...ColorActions }, dispatch) };
  }
)(Home as any);
