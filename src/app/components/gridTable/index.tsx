import { NumberField } from "@components";
import { AppBar, Button, ButtonGroup, IconButton, MenuItem, Paper, Select, Toolbar, Typography } from "@material-ui/core";
import Crop from '@material-ui/icons/Crop';
import DeleteIcon from '@material-ui/icons/Delete';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import InsertPhoto from '@material-ui/icons/InsertPhoto';
import LibraryAddCheck from '@material-ui/icons/LibraryAddCheck';
import PhotoSizeSelectSmall from '@material-ui/icons/PhotoSizeSelectSmall';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import { ColorActions } from "@reducers";
import { FileService } from "@services";
import { ApplicationState } from "@store";
import Konva from "konva";
import * as React from "react";
import { Layer, Stage, Rect } from "react-konva";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

interface GridTableProps extends ApplicationState {
  scale?: number;
  color?: string;
  action?: string;
  selectMode?: boolean;
  image?: { path: string, data: string };
  cellSize?: number;
  ColorActions?: typeof ColorActions;
}

type Props = GridTableProps & ApplicationState;
const RGBToHex = (r, g, b) => {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}
const getImageData = (image) => {
  var myCanvas = document.createElement("canvas");
  var myCanvasContext = myCanvas.getContext("2d");

  var imgWidth = image.width;
  var imgHeight = image.height;
  // You'll get some string error if you fail to specify the dimensions
  myCanvas.width = imgWidth;
  myCanvas.height = imgHeight;
  //  alert(imgWidth);
  myCanvasContext.drawImage(image, 0, 0);

  // var imageData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);

  return myCanvasContext;
}

export class GridTableComp extends React.Component<Props, any> {
  static defaultProps: GridTableProps = {
    scale: 1,
    color: "#ffffff",
    action: "",
    selectMode: false,
    image: { path: null, data: null },
    cellSize: 10,
  }

  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.isDraw = false;
    this.xSize = 20;
    this.ySize = 20;
    this.image = props.image;
    this.imageEl = null;
    this.color = "#ffffff";
    this.layer = React.createRef();
    this.stage = React.createRef();
    this.countInfo = React.createRef();
    this.selectInfo = React.createRef();
    this.scale = 1;
    this.circles = {};
    this.rects = {};
    this.selectMode = false;
    this.state = { image: null, xSize: 20, ySize: 20 }
  }

  color: string;
  image: any;
  xSize: number;
  ySize: number;
  isDraw: boolean;
  layer: React.Ref<any>;
  stage: React.Ref<any>;
  circles: {};
  rects: {};
  scale: number;
  imageEl: HTMLImageElement;
  selectMode: boolean;
  selectRect: Konva.Rect;
  countInfo: React.Ref<any>;
  selectInfo: React.Ref<any>;

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.Color != nextProps.Color)
      return true;
    return false;
  }
  setCircle(x: number, y: number, color = null) {
    if (!color)
      color = this.color;
    const xName: string = `${x}`;
    const yName: string = `${y}`;
    if (color == "hide") {
      if (this.circles[xName] && this.circles[xName][yName]) {
        this.circles[xName][yName].destroy();
        delete this.circles[xName][yName];
        if (Object.keys(this.circles[xName]).length == 0)
          delete this.circles[xName];
      }
      this.rects[x.toString()][y.toString()]["draw"]();
    } else {
      let gridCircle: Konva.Circle;
      if (this.circles[xName] && this.circles[xName][yName]) {
        this.circles[xName][yName].destroy();
      }
      gridCircle = new Konva.Circle({
        x: 2 + (((this.props.cellSize) * x)) + (this.props.cellSize / 2),
        y: 2 + (((this.props.cellSize) * y)) + (this.props.cellSize / 2),
        radius: (this.props.cellSize / 2) - 4,
        strokeWidth: 5,
        stroke: color
      });
      if (!this.circles[xName])
        this.circles[xName] = {};
      this.circles[xName][yName] = gridCircle;
      this.layer["current"].add(gridCircle);
      gridCircle.draw();
    }

    let length = 0;
    Object.getOwnPropertyNames(this.circles).forEach(key => length += Object.getOwnPropertyNames(this.circles[key]).length);
    this.countInfo["current"].innerText = `Toplam : ${length} adet`;
  }
  loadImage() {
    if (!this.image || !this.image.data)
      return;
    Object.getOwnPropertyNames(this.circles).forEach(key => Object.getOwnPropertyNames(this.circles[key]).forEach(rect => this.circles[key][rect].destroy()));
    this.circles = {};
    this.layer["current"].clear();
    this.imageEl = new window.Image();
    this.imageEl.src = this.image.data;
    this.imageEl.addEventListener('load', () => {
      const height = this.imageEl.naturalHeight;
      const width = this.imageEl.naturalWidth;
      const context = getImageData(this.imageEl);

      const size = Math.round(width / this.xSize);
      for (var index = 0; index < this.xSize; index++) {
        for (var index2 = 0; index2 < this.ySize; index2++) {
          const data = context.getImageData(index * size, index2 * size, size, size);
          const length = data.data.length;
          let i = -4;
          let count = 0;
          let rgb = { r: 0, g: 0, b: 0 };
          let blockSize = 4;

          while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
          }
          // ~~ used to floor values
          rgb.r = ~~(rgb.r / count);
          rgb.g = ~~(rgb.g / count);
          rgb.b = ~~(rgb.b / count);
          this.setCircle(index, index2, RGBToHex(rgb.r, rgb.g, rgb.b))
        }
      }
    });
  }
  drawGrid() {
    if (!this.image && !this.image.data) {
      this.layer["current"].clear();
      Object.getOwnPropertyNames(this.circles).forEach(key => Object.getOwnPropertyNames(this.circles[key]).forEach(rect => this.circles[key][rect].destroy()));
      this.circles = {};
    }
    if (this.rects)
      Object.getOwnPropertyNames(this.rects).forEach(key => Object.getOwnPropertyNames(this.rects[key]).forEach(rect => this.rects[key][rect].destroy()));
    this.rects = {};
    Array.from(Array(this.xSize).keys()).forEach((x, xi) => {
      return Array.from(Array(this.ySize).keys()).forEach((y, yi) => {
        const gridRect = new Konva.Rect({
          x: 2 + ((this.props.cellSize) * xi),
          y: 2 + ((this.props.cellSize) * yi),
          width: this.props.cellSize,
          height: this.props.cellSize,
          strokeWidth: 0.2,
          fill: "#424242",
          stroke: "#000"
        });
        if (!this.rects[x])
          this.rects[x] = {};
        this.rects[x][y] = gridRect;
        this.layer["current"].add(gridRect);
        gridRect.draw();
      })
    })
    if (this.circles)
      Object.getOwnPropertyNames(this.circles).forEach(key => Object.getOwnPropertyNames(this.circles[key]).forEach(rect => { this.circles[key][rect].moveToTop(); this.circles[key][rect].draw() }));
    this.setStageSize();
  }
  setStageSize() {
    this.stage["current"].setSize({ width: (this.xSize * this.props.cellSize * this.scale) + 5, height: (this.ySize * this.props.cellSize * this.scale) + 5 });
    this.stage["current"].draw();
  }
  componentDidMount() {
    this.drawGrid();
  }
  handleMouseDown(evt) {
    let xScale = (evt.evt.offsetX / this.scale);
    let yScale = evt.evt.offsetY / this.scale;
    let x = xScale - (xScale % this.props.cellSize);
    let y = yScale - (yScale % this.props.cellSize);
    this.isDraw = true;
    if (!this.selectMode) {
      this.setCircle(Math.floor(x / this.props.cellSize), Math.floor(y / this.props.cellSize));
      return;
    }
    if (!this.selectRect) {
      this.selectRect = new Konva.Rect({
        x: x,
        y: y,
        width: this.props.cellSize,
        height: this.props.cellSize,
        strokeWidth: 2,
        stroke: "#ffffff"
      })
      this.selectRect.moveToTop();
      this.layer["current"].add(this.selectRect);
      this.selectRect.draw();
    } else {
      this.selectRect.moveToTop();
      this.selectRect.show();
      this.selectRect.setSize({ width: this.props.cellSize, height: this.props.cellSize });
      this.selectRect.setPosition({ x: x, y: y });
      this.selectRect.draw();
    }
    this.selectInfo["current"].innerText = `Seçilen 1 adet`;
  }
  handleMouseMove(evt) {
    let xScale = (evt.evt.offsetX / this.scale);
    let yScale = evt.evt.offsetY / this.scale;
    let x = xScale - (xScale % this.props.cellSize);
    let y = yScale - (yScale % this.props.cellSize);
    if (!this.selectMode) {
      if (this.isDraw)
        this.setCircle(Math.floor(x / this.props.cellSize), Math.floor(y / this.props.cellSize));
      return;
    }
    if (!this.selectMode || !this.isDraw)
      return;

    const pos = this.selectRect.getPosition();
    const size = this.selectRect.getSize();
    let curX = x - pos.x;
    let curY = y - pos.y;
    let sizeX = curX - (curX % this.props.cellSize) + this.props.cellSize;
    let sizeY = curY - (curY % this.props.cellSize) + this.props.cellSize;

    if (size.height != sizeY || size.width != sizeX) {
      this.selectRect.setSize({ width: sizeX, height: sizeY });
      this.layer["current"].draw();
    }
    this.selectInfo["current"].innerText = `Seçilen ${(sizeX / this.props.cellSize) * (sizeY / this.props.cellSize)} adet`;

  }
  handleMouseUp(evt) {
    this.isDraw = false;

  }
  render() {
    const stageWidth = (this.state.xSize * this.props.cellSize * this.scale) + 5;
    const stageHeight = (this.state.ySize * this.props.cellSize * this.scale) + 5;
    return (
      <React.Fragment>
        <Paper style={{ overflow: "auto", width: "100%", height: "100%", position: "relative", flexGrow: 1, paddingTop: 65 }}>
          <AppBar position="fixed" color={"default"} style={{ top: 48 }}>
            <Toolbar>
              <IconButton
                style={{ border: "1px solid #fff", marginRight: 10 }}
                title="Resim Yükle"
                onClick={async () => {
                  const result = await FileService.getList();
                  if (!result.hasErrors()) {
                    this.image = result.value;
                    this.loadImage();
                  }
                }}>
                <InsertPhoto />
              </IconButton>
              <NumberField
                label={"Genişlik"}
                style={{ width: 50, marginRight: 20 }}
                defaultValue={this.xSize}
                onChange={(event) => {
                  if (event.target.value <= 200 || !event.target.value) {
                    this.xSize = event.target.value;
                  }
                }} />
              <NumberField
                label={"Yükseklik"}
                style={{ width: 50, marginRight: 20 }}
                defaultValue={this.ySize}
                onChange={(event) => {
                  if (event.target.value <= 200 || !event.target.value) {
                    this.ySize = event.target.value;
                  }
                }}
              />
              <ButtonGroup color="default"
                style={{ marginRight: 10 }}
              >
                <Button
                  title="Uygula"
                  onClick={async () => {
                    this.drawGrid();
                    this.setStageSize();
                    this.loadImage();
                  }}>
                  <LibraryAddCheck />
                </Button>
              </ButtonGroup>
              <ButtonGroup color="default" style={{ marginRight: 10 }}>
                <Button
                  title="Küçült"
                  onClick={async () => {
                    this.scale -= 0.1;
                    this.stage["current"].scale({ x: this.scale, y: this.scale });
                    this.setStageSize();
                  }}>
                  <ZoomOut />
                </Button>

                <Button
                  title="Büyült"
                  onClick={async () => {
                    this.scale += 0.1;
                    this.stage["current"].scale({ x: this.scale, y: this.scale });
                    this.setStageSize();
                  }}>
                  <ZoomIn />
                </Button>
              </ButtonGroup>
              <ButtonGroup color="default" style={{ marginRight: 10 }}>
                <Button
                  title="Seç"
                  onClick={async () => {
                    this.selectMode = !this.selectMode;
                    if (this.selectRect) {
                      this.selectRect.hide();
                      this.layer["current"].draw();
                    }
                  }}>
                  <PhotoSizeSelectSmall />
                </Button>
                <Button
                  title="Kırp"
                  onClick={async () => {
                    if (this.selectMode && this.selectRect) {
                      const pos = this.selectRect.getPosition();
                      const size = this.selectRect.getSize();
                      let startX = (pos.x - (pos.x % this.props.cellSize)) / this.props.cellSize;
                      let startY = (pos.y - (pos.y % this.props.cellSize)) / this.props.cellSize;
                      let endX = startX + ((size.width - (size.width % this.props.cellSize)) / this.props.cellSize);
                      let endY = startY + ((size.height - (size.height % this.props.cellSize)) / this.props.cellSize);
                      if (this.selectRect) {
                        this.selectRect.hide();
                        this.layer["current"].draw();
                      }
                      const d = {};
                      let xi = 0;
                      let yi = 0;

                      for (var i = startX; i < endX; i++) {
                        for (var c = startY; c < endY; c++) {
                          if (this.circles[i.toString()] && this.circles[i.toString()][c.toString()]) {
                            if (!d[xi.toString()])
                              d[xi.toString()] = {};
                            const cPos = this.circles[i.toString()][c.toString()].getPosition();
                            this.circles[i.toString()][c.toString()].setPosition({ x: cPos.x - (startX * this.props.cellSize), y: cPos.y - (startY * this.props.cellSize) })
                            const pos = this.circles[i.toString()][c.toString()].getPosition();
                            d[xi.toString()][yi.toString()] = new Konva.Circle({
                              x: pos.x,
                              y: pos.y,
                              radius: (this.props.cellSize / 2) - 4,
                              strokeWidth: 5,
                              stroke: this.circles[i][c].getStroke()
                            })
                            this.layer["current"].add(d[xi.toString()][yi.toString()]);
                          }
                          yi++;
                        }
                        xi++;
                      }
                      Object.getOwnPropertyNames(this.circles).forEach(key => Object.getOwnPropertyNames(this.circles[key]).forEach(rect => this.circles[key][rect].destroy()));
                      this.circles = d;
                      
                      this.xSize = endX - startX;
                      this.ySize = endY - startY;
                      
                      this.setStageSize();
                      this.drawGrid();
                    }
                  }}>
                  <Crop />
                </Button>
              </ButtonGroup>
              <ButtonGroup color="default" style={{ marginRight: 10 }}>
                <Button
                  title="Seç"
                  onClick={async () => {
                    this.selectMode = false;
                    this.color = "hide";
                    if (this.selectRect) {
                      // this.selectRect.hide();
                      this.stage["current"].draw();
                    }
                  }}>
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
              <Select defaultValue="#ffffff"
                onChange={(evt) => {
                  this.color = evt.target.value.toString();
                }}>
                {
                  this.props.Color.List.map((c, i) => {
                    return <MenuItem key={i} value={c.code}><FiberManualRecordIcon htmlColor={c.code} /></MenuItem>
                  })

                }
              </Select>
              <Typography style={{ flexGrow: 1 }} variant="caption" />
              <Typography style={{ marginRight: 10 }} variant="caption" ref={this.countInfo} />
              <Typography variant="caption" ref={this.selectInfo}></Typography>
            </Toolbar>

          </AppBar>
          <div>
            <Stage
              ref={this.stage}
              scale={{ x: this.scale, y: this.scale }}
              width={stageWidth}
              height={stageHeight}>

              <Layer
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                ref={this.layer}>
              </Layer>
            </Stage>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

// export const GridTable = GridTableComponent;
export const GridTable = (
  connect(
    (state: ApplicationState) => state,
    dispatch => {
      return { ColorActions: bindActionCreators({ ...ColorActions }, dispatch) };
    }
  )(GridTableComp)
) as any;
