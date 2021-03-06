import { Sidebar, Topbar } from "@components";
import MomentUtils from "@date-io/moment";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from "@material-ui/core/Grid";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { ApplicationState } from "@store";
import { theme } from '@Ui';
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";
import { bindActionCreators } from "redux";
moment.locale("tr");

class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      sideBarToggle: false,
      isLogin: false
    };
    this.onCloseMenu = this.onCloseMenu.bind(this);
    this.onOpenMenu = this.onOpenMenu.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    // this.setState({ sideBarToggle: window.innerWidth > 576 })
  }

  onOpenMenu(event) {
    this.setState({
      sideBarToggle: true
    });
  }

  onCloseMenu(event) {
    this.setState({
      sideBarToggle: false
    });
  }

  public render() {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}

            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}>
            <div style={{ paddingTop: 48, overflow: "hidden", width: "100%", height: "100%" }}>
              <CssBaseline />
              <Topbar onOpenMenu={this.onOpenMenu} onCloseMenu={this.onCloseMenu} theme={theme} left={this.state.sideBarToggle ? 240 : 0} />
              <Sidebar onOpenMenu={this.onOpenMenu} onCloseMenu={this.onCloseMenu} isOpen={this.state.sideBarToggle} theme={theme} width={this.state.sideBarToggle ? 240 : 0} />

              <main style={{
                flexGrow: 1,
                marginLeft: 0,//this.state.sideBarToggle ? 240 : 0,
                transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                display: 'flex',
                height: "100%",
                width: "100%",
                flexDirection: 'column',
                paddingTop: 20,
                paddingBottom: 20,
                overflow: "auto",
                minHeight: "100%", margin: 0, padding: 0 
              }}>
                {/* <div style={{ minHeight: 64 }} /> */}

                <Container maxWidth="xl" style={{ height: "100%", margin: 0, padding: 0  }}>
                  <MuiPickersUtilsProvider utils={MomentUtils} locale="tr">
                    <Grid container spacing={2} style={{ width: "100%", height: "100%", margin: 0, padding: 0 }} >
                      {/* <Routes/> */}
                      {this.props.children}
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Container>
                {/* <Footer /> */}
              </main>
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </React.Fragment >
    );
  }
}

export const component = withRouter(connect(
  (state: ApplicationState) => state,
  dispatch => {
    return {};
    // return { ChannelActions: bindActionCreators({ ...ChannelActions }, dispatch) };
  }
)(App as any) as any);
