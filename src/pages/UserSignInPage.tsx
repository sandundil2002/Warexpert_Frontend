import {AuthImageComponent} from "../components/authentication/image/AuthImageComponent.tsx";
import {AuthInputComponent} from "../components/authentication/input/AuthInputComponent.tsx";
import {AuthButtonComponent} from "../components/authentication/button/AuthButtonComponent.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store.ts";
import {loginUser} from "../reducers/user-slice.ts";
import {unwrapResult} from "@reduxjs/toolkit";

export const UserSignInPage = () => {
    const isLoading = useSelector((state: RootState) => state.user.loading);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async () => {
        if (email === '' || password === '') {
            setShowAlert(true);
            return;
        }

        const user = {
            username: email,
            password: password,
        };

        try {
            const resultAction = await dispatch(loginUser(user));
            const response = unwrapResult(resultAction);

            if (response && response.accessToken) {
                console.log("Login successful. Navigating to dashboard...");
                navigate('/dashboard');
            } else {
                console.error("Login failed. No token received.");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            setShowAlert(true);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-300 p-4">
                <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
                    <AuthImageComponent src="src/assets/login-img.png" alt="Sign In Illustration"/>

                    <div className="w-full md:w-1/2 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl uppercase font-bold text-blue-700">Sign In</h2>
                            <p className="text-gray-500 mt-2">Enter your email and password to sign in</p>
                        </div>

                        {showAlert && (
                            <div
                                className="flex items-center p-4 mb-4 text-sm text-white bg-red-500 rounded-lg shadow-md"
                                role="alert">
                                <svg className="w-5 h-5 mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9v2h2V9H9zm0 4v2h2v-2H9z"
                                        clipRule="evenodd"></path>
                                </svg>
                                <span className="font-medium">Error:</span> Please fill in all fields correctly.
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-center mb-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <AuthInputComponent id="email" type="email" placeholder="name@gmail.com" label="Your Email"
                                                onChange={(e) => setEmail(e.target.value)}/>
                            <AuthInputComponent id="password" type="password" placeholder="••••••••" label="Password"
                                                onChange={(e) => setPassword(e.target.value)}/>

                            <div className="text-right">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500"> Forgot
                                password
                                </a>
                            </div>

                            <AuthButtonComponent type="submit" text="Login" onClick={handleSubmit}/>
                            <div className="space-y-3">
                                <button type="button" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <img src="src/assets/google-logo-24.png" className="mx-2" alt="google-logo"/>
                                    SIGN IN WITH GOOGLE
                                </button>
                            </div>

                            <p className="text-center text-sm text-gray-600"> Not registered?{' '}
                                <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-500"> Create
                                account </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};