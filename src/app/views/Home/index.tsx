import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

type Props = ApplicationState;

class Home extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div style={{ width: "100%", height: 500 }}>
deneme
      </div>
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
