import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";

export const MainPage = () => {
    const jwtToken = useSelector((state: RootState) => state.user.jwt_token);

    return (
        <>
            <p>Your JWT Token:</p>
            <p>{jwtToken || "No token available"}</p>
        </>
    );
};