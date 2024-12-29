import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { RootState } from "../store/store";

interface RouterGuardProps {
    children: ReactNode;
}

export default function RouterGuard({ children }: RouterGuardProps): JSX.Element {
    const state = useSelector((state: RootState) => state.users);

    if (!state.token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
