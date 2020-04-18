import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import { withRouter } from "react-router-dom";
import AppSubmenu from './subMenu';

class AppSubmenuItem extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { activeIndex: "", open: false };
    }

    onMenuItemClick(event, item) {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        //prevent hash change
        if (item.items || !item.url) {
            event.preventDefault();
            if (item.items && item.items.length > 0) {
                this.setState({ open: !this.state.open })
            }
            return;
        }

        if (this.props.onChangeLocation) {
            this.props.onChangeLocation({
                originalEvent: event,
                item: item
            });
        }
    }

    render() {
        const { item } = this.props;
        return (
            <React.Fragment>
                <ListItem button style={{ paddingLeft: 10 * (this.props.depth || 1), overflow: "hidden", width: 240 }} onClick={(e) => this.onMenuItemClick(e, item)}>
                    <ListItemIcon style={{ minWidth: 32 }}>
                        <Icon className={item.icon} color="action" />
                    </ListItemIcon>
                    <ListItemText primary={item.label} style={{ fontSize: 10 }} />
                    {item.items && item.items.length > 0 ?
                        (this.state.open ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItem>
                {item.items && item.items.length > 0 ?
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <AppSubmenu items={item.items} depth={(this.props.depth || 1) + 1} onChangeLocation={this.props.onChangeLocation.bind(this)} />
                        </List>
                    </Collapse> : null}
            </React.Fragment>
        )
    }
}

export default withRouter(AppSubmenuItem);