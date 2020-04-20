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
    cellSize: 30,
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
    this.circles = [];
    this.rects = [];
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
  circles: any[][];
  rects: any[][];
  scale: number;
  imageEl: HTMLImageElement;
  selectMode: boolean;
  selectRect: Konva.Rect;
  countInfo: React.Ref<any>;
  selectInfo: React.Ref<any>;

  componentDidUpdate() {
    // this.loadImage()

  }
  shouldComponentUpdate(nextProps, nextState) {
    this.xSize = nextProps.xSize;
    this.ySize = nextProps.ySize;
    if (this.props.xSize != nextProps.xSize || this.props.ySize != nextProps.ySize) {
      this.xSize = nextProps.xSize;
      this.ySize = nextProps.ySize;
      this.rects = [];
      this.circles = [];
      this.stage["current"].clear();
      this.stage["current"].draw();
      this.loadImage();
      return true;
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

  setCircle(x, y, color = null) {
    if (!color)
      color = this.color;
    if (color == "hide") {
      this.circles[x][y].hide()
      this.rects[x][y]["draw"]()
    } else if (this.circles[x] && this.circles[x][y]) {

      this.circles[x][y].show()
      this.circles[x][y]["setStroke"](color)
      this.circles[x][y]["draw"]()
    }
    let count = 0;
    for (var i = 0; i < this.circles.length; i++) {
      for (var c = 0; c < this.circles[i].length; c++) {
        if (this.circles[i][c].attrs.visible)
          count++;
      }
    }
    this.countInfo["current"].innerText = `Toplam : ${count} adet`;
  }
  loadImage() {
    if (!this.image || !this.image.data)
      return;
    this.imageEl = new window.Image();
    this.imageEl.src = this.image.data;//"https://instagram.fbtz1-7.fna.fbcdn.net/v/t51.2885-19/s320x320/67893400_748297338934110_1352840579989372928_n.jpg?_nc_ht=instagram.fbtz1-7.fna.fbcdn.net&_nc_ohc=SDq1p6I4Mx4AX9rGnkz&oh=63d8c7114e4658709687e6539a4952cf&oe=5EC67931";
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
  componentDidMount() {

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
                if (!this.selectMode)
                  return;
                let x = evt.evt.offsetX / this.scale;
                let y = evt.evt.offsetY / this.scale;
                this.isDraw = true;
                if (!this.selectRect) {
                  this.selectRect = new Konva.Rect({
                    x: x - (x % this.props.cellSize),
                    y: y - (y % this.props.cellSize),
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
                  this.selectRect.setPosition({ x: x - (x % this.props.cellSize), y: y - (y % this.props.cellSize) });
                  this.layer["current"].draw();
                }
                this.selectInfo["current"].innerText = `Seçilen 1 adet`;
              }}
              onMouseMove={(evt) => {
                if (!this.selectMode || !this.isDraw)
                  return;
                const pos = this.selectRect.getPosition();
                const size = this.selectRect.getSize();
                let x = evt.evt.offsetX / this.scale;
                let y = evt.evt.offsetY / this.scale;
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
                for (var i = startX; i < endX; i++)
                  for (var c = startY; c < endY; c++) {
                    if (this.circles[i] && this.circles[i][c])
                      d.push(this.circles[i][c]);
                  }
              }}
              onMouseLeave={() => {
                this.isDraw = false;
              }}>

              {
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
              }
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
