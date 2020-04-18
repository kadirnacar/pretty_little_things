import { ApplicationState } from "@store";
import * as React from "react";
import { Layer, Rect, Stage } from "react-konva";
import Slider from '@material-ui/core/Slider';

interface GridTableProps extends ApplicationState {
  xSize?: number;
  ySize?: number;
  scale?: number;
  color?: string;
  cellSize?: number;
}

type Props = GridTableProps;

export class GridTable extends React.Component<Props, any> {
  static defaultProps: GridTableProps = {
    xSize: 50,
    ySize: 50,
    scale: 1,
    color: "#ffffff",
    cellSize: 30,
  }

  constructor(props) {
    super(props);
    this.isDraw = false;
    this.scale = 1;
    this.color = "#ffffff";
    this.layer = React.createRef();
    this.state = { scale: 1 }
  }
  color: string;
  isDraw: boolean;
  layer: React.Ref<any>;
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps.scale)
    if (this.props.xSize != nextProps.xSize)
      return true;
    if (this.props.ySize != nextProps.ySize)
      return true;
    if (this.props.cellSize != nextProps.cellSize)
      return true;
    if (this.props.scale != nextProps.scale) {
      return true;
    }
    if (this.color != nextProps.color) {
      this.color = nextProps.color;
      return false;
    }
    return false;
  }
  scale: number;
  render() {
    console.log("render", this.props.xSize, this.props.ySize);
    return (
      <Stage
        style={{}}
        scale={{ x: this.props.scale, y: this.props.scale }}
        width={this.props.xSize * this.props.cellSize}
        height={this.props.ySize * this.props.cellSize}>
        <Layer
          ref={this.layer}
          scale={{ x: this.props.scale, y: this.props.scale }}
          onMouseLeave={() => {
            this.isDraw = false;
          }}>
          {
            Array.from(Array(this.props.xSize).keys()).map((x, xi) => {
              return Array.from(Array(this.props.ySize).keys()).map((y, yi) => {
                return <Rect
                  key={yi}
                  x={2 + ((this.props.cellSize) * xi)}
                  y={2 + ((this.props.cellSize) * yi)}
                  width={this.props.cellSize}
                  height={this.props.cellSize}
                  fillEnabled={true}
                  fill={"#cccccc"}
                  strokeWidth={0.2}
                  stroke={"#000"}
                  onMouseOver={(e) => {
                    if (this.isDraw) {
                      e.currentTarget["setFill"](this.color)
                      e.currentTarget["draw"]()
                    }
                  }}
                  onMouseUp={() => {
                    this.isDraw = false;
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget["setFill"](this.color)
                    e.currentTarget["draw"]()
                    this.isDraw = true;
                  }}
                />
              })
            })
          }
        </Layer>
      </Stage>
    );
  }
}

// export const GridTable = GridTableComponent;
// export const GridTable = withRouter(
//   connect(
//     (state: ApplicationState) => state,
//     null
//     // dispatch => {
//     //   return { AuthActions: bindActionCreators({ ...AuthActions }, dispatch) };
//     // }
//   )(GridTableComponent)
// ) as any;
