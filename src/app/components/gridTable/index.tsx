import { ColorActions } from "@reducers";
import { ApplicationState } from "@store";
import * as React from "react";
import { Circle, Image, Layer, Rect, Stage } from "react-konva";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

interface GridTableProps extends ApplicationState {
  xSize?: number;
  ySize?: number;
  scale?: number;
  color?: string;
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
    image: { path: null, data: null },
    cellSize: 30,
  }

  constructor(props) {
    super(props);
    this.isDraw = false;
    this.scale = 1;
    this.xSize = props.xSize;
    this.ySize = props.ySize;
    this.image = props.image;
    this.imageEl = null;
    this.color = "#ffffff";
    this.layer = React.createRef();
    this.stage = React.createRef();
    this.circles = [];
    this.rects = [];
    this.state = { scale: 1, image: null }
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

  componentDidUpdate() {
    // this.loadImage()

  }
  shouldComponentUpdate(nextProps, nextState) {
    this.xSize = nextProps.xSize;
    this.ySize = nextProps.ySize;
    this.scale = nextProps.scale;
    if (this.props.xSize != nextProps.xSize || this.props.ySize != nextProps.ySize) {
      this.xSize = nextProps.xSize;
      this.ySize = nextProps.ySize;
      this.scale = nextProps.scale;
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
    if (this.props.scale != nextProps.scale) {
      this.scale = nextProps.scale;
      this.stage["current"].setScale({ x: this.scale, y: this.scale });
      // this.layer["current"].draw();
      this.stage["current"].setWidth(this.xSize * this.props.cellSize * this.scale);
      this.stage["current"].setHeight(this.ySize * this.props.cellSize * this.scale);
      this.stage["current"].draw();
      return false;
    }
    if (this.props.color != nextProps.color) {
      this.color = nextProps.color;
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
    return (
      <React.Fragment>
        <Stage
          ref={this.stage}
          scale={{ x: this.props.scale, y: this.props.scale }}
          width={this.props.xSize * this.props.cellSize * this.props.scale}
          height={this.props.ySize * this.props.cellSize * this.props.scale}>
          <Layer
            ref={this.layer}
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
                        if (this.isDraw) {
                          this.setCircle(xi, yi);
                        }
                      }}
                      onMouseUp={() => {
                        this.isDraw = false;
                      }}
                      onMouseDown={(e) => {
                        this.setCircle(xi, yi);
                        this.isDraw = true;
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
                        if (this.isDraw) {
                          this.setCircle(xi, yi);
                        }
                      }}
                      onMouseUp={() => {
                        this.isDraw = false;
                      }}
                      onMouseDown={(e) => {
                        this.setCircle(xi, yi);
                        this.isDraw = true;
                      }}
                    ></Circle>
                  </React.Fragment>
                })
              })
            }
          </Layer>
        </Stage>
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
