import { GridTable, NumberField } from "@components";
import { Grid, Paper, Slider } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import InsertPhoto from '@material-ui/icons/InsertPhoto';
import LibraryAddCheck from '@material-ui/icons/LibraryAddCheck';
import PhotoSizeSelectSmall from '@material-ui/icons/PhotoSizeSelectSmall';

import { ColorActions } from "@reducers";
import { FileService } from "@services";
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
      selectMode: false,
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

                <IconButton
                  style={{ border: "1px solid #fff", marginRight: 10 }}
                  title="Resim Yükle"
                  onClick={async () => {
                    const result = await FileService.getList();
                    if (!result.hasErrors())
                      this.setState({ image: result.value })
                  }}>
                  <InsertPhoto />
                </IconButton>
                <IconButton
                  style={{ border: "1px solid #fff", marginRight: 10 }}
                  title="Se."
                  onClick={async () => {
                    this.setState({ selectMode: true })
                  }}>
                  <PhotoSizeSelectSmall />
                </IconButton>
                <IconButton
                  style={{ border: "1px solid #fff" }}
                  title="Uygula"
                  onClick={async () => {
                    this.setState({
                      xSize: this.state.xSize_temp,
                      ySize: this.state.ySize_temp,
                      scale: this.state.scale_temp,
                    })
                  }}>
                  <LibraryAddCheck />
                </IconButton>

              </Grid>
              <Grid item xs={12}>
                <IconButton
                  style={{ border: this.state.color == "hide" ? "1px solid #fff" : "none" }}
                  onClick={() => {
                    this.setState({ color: "hide", selectMode: false })
                  }}>
                  <DeleteIcon />
                </IconButton>
                {this.props.Color && this.props.Color.List ? this.props.Color.List.map((item, index) => {
                  return <IconButton
                    key={index}
                    style={{ border: this.state.color == item.code ? "1px solid #fff" : "none" }}
                    onClick={() => {
                      this.setState({ color: item.code , selectMode: false})
                    }}>
                    <FiberManualRecordIcon htmlColor={item.code} />
                  </IconButton>
                }) : null}

              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8} style={{ height: "100%" }}>
          <Paper style={{ overflow: "auto", height: "100%", position: "relative" }}>
            <GridTable
              image={this.state.image}
              color={this.state.color}
              selectMode={this.state.selectMode}
              ySize={this.state.ySize}
              xSize={this.state.xSize}
              zoom={this.state.scale}
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
