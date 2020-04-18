import { Theme } from "@material-ui/core";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { ApplicationState } from "@store";
import * as React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import AppMenu from "./menu";
import { bindActionCreators } from "redux";

interface SidebarProps {
  isOpen: boolean;
  theme: Theme;
  width: number;
  onOpenMenu: (event: any) => void;
  onCloseMenu: (event: any) => void;
}

type Props = RouteComponentProps & SidebarProps & ApplicationState;

export class SidebarComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.state = {
      menu: [],
    }
  }

  layoutMenuScroller: any;

  onSidebarClick(event) {

  }
  async componentDidMount() {
    
  }
  render() {
    return (
      <Drawer
        onMouseLeave={this.props.onCloseMenu}
        onMouseEnter={this.props.onOpenMenu}
        variant="permanent"
        open={this.props.isOpen}
        style={{
          width: this.props.width,
          transition: this.props.theme.transitions.create('width', {
            easing: this.props.theme.transitions.easing.sharp,
            duration: this.props.theme.transitions.duration.leavingScreen,
          })
        }}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(90,90,90,0.7)',
            color: "#fff",
            width: this.props.width,
            transition: this.props.theme.transitions.create('width', {
              easing: this.props.theme.transitions.easing.sharp,
              duration: this.props.theme.transitions.duration.leavingScreen,
            })
          }
        }}
      >
        <Avatar variant="square" style={{ width: "100%", height: 48 }}
          imgProps={{
            style: { height: 40, objectFit: "contain" }
          }} />
        <Divider />

        <Scrollbars>
          <List>
            <div>
              <AppMenu model={this.state.menu} parentIndex={0} />
            </div>
          </List>
        </Scrollbars>
      </Drawer>
    );
  }
}

// export default Sidebar;
export const Sidebar = withRouter(
  connect(
    (state: ApplicationState) => state,
    dispatch => {
      return {}
      // return { ChannelActions: bindActionCreators({ ...ChannelActions }, dispatch) };
    }
  )(SidebarComponent)
) as any;
