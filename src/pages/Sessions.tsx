import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getUsersSessions } from "../store/slices/accountSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Toolbar,
    Typography,
} from "@mui/material";
import { format } from "date-fns";

interface Session {
    userId: string;
    loginTime: string;
    logoutTime: string;
    sessionDuration: string;
}
const Sessions = () => {
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const sessions: Session[] = userState.users_sessions || [];
    console.log(sessions);

    useEffect(() => {
        dispatch(getUsersSessions({ token: userState.token }));
    }, [dispatch, userState.token]);
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "yyyy-MM-dd hh:mm:ss a");
    };
    return (
        <>
            <Toolbar
                sx={[
                    { pl: { sm: 0 }, pr: { xs: 0, sm: 1 } },
                ]}
            >
                <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
                    Users Sessions
                </Typography>
            </Toolbar>
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>User ID</strong></TableCell>
                            <TableCell><strong>Login Time</strong></TableCell>
                            <TableCell><strong>Logout Time</strong></TableCell>
                            <TableCell><strong>Session Duration</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map((session: Session) => (
                            <TableRow key={session.userId}>
                                <TableCell>{session.userId}</TableCell>
                                <TableCell>{formatDate(session.loginTime)}</TableCell>
                                <TableCell>{formatDate(session.logoutTime)}</TableCell>
                                <TableCell>{session.sessionDuration}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Sessions;
