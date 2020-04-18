import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Copyright from '@material-ui/icons/Copyright';

export class Footer extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    render() {
        return <footer style={{
            backgroundColor: '#4c4c4c',
        }}>
            <Container maxWidth="sm">
                <Typography variant="body1">Bengsoft <Copyright /> </Typography>
            </Container>
        </footer>
    }
}
export default Footer;