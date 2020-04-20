import { ColorActions } from "@reducers";
import { ApplicationState } from "@store";
import * as React from "react";
import { Circle, Image, Layer, Rect, Stage } from "react-konva";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Konva from "konva";
import { Paper } from "@material-ui/core";

interface GridTableProps extends ApplicationState {
  xSize?: number;
  ySize?: number;
  scale?: number;
  color?: string;
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
    xSize: 20,
    ySize: 20,
    scale: 1,
    color: "#ffffff",
    selectMode: false,
    image: { path: null, data: null },
    cellSize: 10,
  }

  constructor(props) {
    super(props);
    this.isDraw = false;
    this.xSize = props.xSize;
    this.ySize = props.ySize;
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
    this.state = { image: null }
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
    this.xSize = nextProps.xSize;
    this.ySize = nextProps.ySize;
    if (this.props.xSize != nextProps.xSize || this.props.ySize != nextProps.ySize) {
      this.xSize = nextProps.xSize;
      this.ySize = nextProps.ySize;
      this.drawGrid();
      this.stage["current"].setSize({ width: nextProps.xSize * this.props.cellSize * this.scale, height: nextProps.ySize * this.props.cellSize * this.scale });
      this.stage["current"].draw();

      this.loadImage();
      return false;
    }
    if (this.props.cellSize != nextProps.cellSize)
      return true;
    if (nextProps.image && this.props.image.path != nextProps.image.path) {
      this.image = nextProps.image;
      this.loadImage();
      return false;
    }
    if (this.scale != nextProps.scale) {
      this.scale = nextProps.scale;
      this.stage["current"].setScale({ x: this.scale, y: this.scale });
      this.stage["current"].setSize({ width: nextProps.xSize * this.props.cellSize * this.scale, height: nextProps.ySize * this.props.cellSize * this.scale });
      this.stage["current"].draw();
      return false;
    }
    if (this.props.color != nextProps.color || this.props.selectMode != nextProps.selectMode) {
      this.color = nextProps.color;
      this.selectMode = nextProps.selectMode;
      if (this.selectRect) {
        this.selectRect.hide();
        this.stage["current"].draw();
      }
      return false;
    }
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
    this.layer["current"].clear();
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
  }

  componentDidMount() {
    this.drawGrid();
  }

  render() {
    const stageWidth = this.props.xSize * this.props.cellSize * this.scale;
    const stageHeight = this.props.ySize * this.props.cellSize * this.scale;
    return (
      <div>
        <Paper style={{ height: 30, position: "sticky", zIndex: 99, top: 0 }}>
          <div style={{ marginRight: 20, float: "left" }} ref={this.countInfo}></div>
          <div style={{ float: "left" }} ref={this.selectInfo}></div>
        </Paper>
        <div>
          <Stage
            ref={this.stage}
            scale={{ x: this.scale, y: this.scale }}
            width={stageWidth}
            height={stageHeight}>
            <Layer
              ref={this.layer}
              onMouseDown={(evt) => {
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
                  this.layer["current"].add(this.selectRect);
                  this.layer["current"].draw();
                } else {
                  this.selectRect.show();
                  this.selectRect.setSize({ width: this.props.cellSize, height: this.props.cellSize });
                  this.selectRect.setPosition({ x: x, y: y });
                  this.layer["current"].draw();
                }
                this.selectInfo["current"].innerText = `Seçilen 1 adet`;
              }}
              onMouseMove={(evt) => {
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
              }}
              onMouseUp={() => {
                this.isDraw = false;
                if (!this.selectMode)
                  return;
                const pos = this.selectRect.getPosition();
                const size = this.selectRect.getSize();
                let startX = (pos.x - (pos.x % this.props.cellSize)) / this.props.cellSize;
                let startY = (pos.y - (pos.y % this.props.cellSize)) / this.props.cellSize;
                let endX = startX + ((size.width - (size.width % this.props.cellSize)) / this.props.cellSize);
                let endY = startY + ((size.height - (size.height % this.props.cellSize)) / this.props.cellSize);

                // if (endX < startX) {
                //   const temp = endX;
                //   endX = startX;
                //   startX = temp;
                // }
                // if (endY < startY) {
                //   const temp = endY;
                //   endY = startY;
                //   startY = temp;
                // }
                const d = [];
                // for (var i = startX; i < endX; i++)
                //   for (var c = startY; c < endY; c++) {
                //     if (this.circles[i] && this.circles[i][c])
                //       d.push(this.circles[i][c]);
                //   }
              }}
              onMouseLeave={() => {
                this.isDraw = false;
              }}>
              {/* <Rect x={0} y={0}
                width={stageWidth}
                height={stageHeight}>

              </Rect> */}
              {/* {
                Array.from(Array(this.props.xSize).keys()).map((x, xi) => {
                  return Array.from(Array(this.props.ySize).keys()).map((y, yi) => {
                    return <React.Fragment key={yi}>
                      <Rect
                        ref={(c) => {
                          if (!this.rects[xi])
                            this.rects[xi] = [];
                          this.rects[xi][yi] = c
                        }}
                        x={2 + ((this.props.cellSize) * xi)}
                        y={2 + ((this.props.cellSize) * yi)}
                        width={this.props.cellSize}
                        height={this.props.cellSize}
                        strokeWidth={0.2}
                        fill={"#424242"}
                        stroke={"#000"}
                        onMouseOver={(e) => {
                          if (this.isDraw && !this.selectMode) {
                            this.setCircle(xi, yi);
                          }
                        }}
                        onMouseUp={() => {
                          this.isDraw = false;
                        }}
                        onMouseDown={(e) => {
                          if (!this.selectMode) {
                            this.setCircle(xi, yi);
                            this.isDraw = true;
                          }
                        }}
                      >
                      </Rect>
                      <Circle
                        ref={(c) => {
                          if (!this.circles[xi])
                            this.circles[xi] = [];
                          this.circles[xi][yi] = c
                        }}

                        x={2 + (((this.props.cellSize) * xi)) + (this.props.cellSize / 2)}
                        y={2 + (((this.props.cellSize) * yi)) + (this.props.cellSize / 2)}
                        radius={(this.props.cellSize / 2) - 4}
                        strokeWidth={8}
                        visible={false}
                        onMouseOver={(e) => {
                          if (this.isDraw && !this.selectMode) {
                            this.setCircle(xi, yi);
                          }
                        }}
                        onMouseUp={() => {
                          this.isDraw = false;
                        }}
                        onMouseDown={(e) => {
                          if (!this.selectMode) {
                            this.setCircle(xi, yi);
                            this.isDraw = true;
                          }
                        }}
                      ></Circle>
                    </React.Fragment>
                  })
                })
              } */}
            </Layer>
          </Stage>
        </div>
      </div>
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
