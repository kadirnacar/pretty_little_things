import { TextField, ColorField } from '@components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { ApplicationState } from "@store";
import MaterialTable from 'material-table';
import * as React from "react";
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ColorActions } from '@reducers';

type Props = ApplicationState & { ColorActions: typeof ColorActions } & RouteComponentProps
class Settings extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Renkler"
            action={
              <React.Fragment>
                <Button
                  variant="contained"
                  onClick={async () => {
                    this.props.history.goBack();
                  }}>İptal</Button>

                <Button
                  color="primary"
                  variant="contained"
                  onClick={async () => {
                    await this.props.ColorActions.save(this.props.Color.List)
                  }}>Kaydet</Button>
              </React.Fragment>
            } />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <MaterialTable
                style={{ width: "100%", position: "inherit" }}
                options={{ search: false, showTitle: false, paging: false }}
                editable={{
                  onRowDelete: oldData => new Promise(resolve => {
                    this.props.Color.List.splice(oldData["tableData"].id, 1);
                    this.setState({})
                    resolve();
                  }),
                }}
                columns={[
                  {
                    title: "Renk Kodu", field: "code", render: (data, type) => {
                      return <ColorField
                        value={data.code}
                        label='Renk'
                        onChange={(event) => {
                          data.code = event.target.value.hex;
                          this.setState({});
                        }}
                      />
                    }
                  }
                ]}
                data={this.props.Color.List}
                actions={[
                  {
                    icon: 'add',
                    tooltip: 'Ekle',
                    isFreeAction: true,
                    onClick: (event) => {
                      this.props.Color.List.push({
                        code: "",
                      });
                      this.setState({})
                    }
                  }]}

                detailPanel={[{
                  render: rowData => {
                    return (
                      <Grid container style={{ padding: 30, width: "100%", backgroundColor: "#303030", margin: 0 }} spacing={3}>
                        <ColorField
                          value={rowData.code}
                          label='Renk'
                          onChange={(event) => {
                            rowData.code = event.target.value.hex;
                            this.setState({});
                          }}
                        />



                      </Grid>
                    );
                  }
                }]}
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
// export default Settings;

export const component = withRouter(connect(
  (state: ApplicationState) => state,
  dispatch => {
    return { ColorActions: bindActionCreators({ ...ColorActions }, dispatch) };
  }
)(Settings)) as any;
