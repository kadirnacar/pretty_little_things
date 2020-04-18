import { toast } from "react-toastify";
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
    mixins: {
        toolbar: {
            minHeight: 48,
            backgroundColor:"transparent"
        }
    }
});
export class Ui {

    static showErrors(messages) {
        if (Array.isArray(messages)) {
            messages.forEach(x => {
                if (!Array.isArray(x)) {
                    toast.error(x);
                    console.error(x);
                }
                else {
                    (x as any).forEach((y: string) => toast.error(y));
                }
            });
        } else {
            toast.error(messages);
            console.error(messages);
        }
    }

    static showInfo(message: string) {
        toast.info(message);
        console.info(message);
    }
}