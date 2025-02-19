import {AuthInputComponent} from "../components/authentication/input/AuthInputComponent.tsx";
import {AuthButtonComponent} from "../components/authentication/button/AuthButtonComponent.tsx";
import {AuthImageComponent} from "../components/authentication/image/AuthImageComponent.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store.ts";
import {registerUser} from "../reducers/user-slice.ts";
import {User} from "../model/user.ts";
import {unwrapResult} from "@reduxjs/toolkit";

export const UserSignUpPage = () => {
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

        const user: User = {
            username: email,
            password: password,
        };

        try {
            const resultAction = await dispatch(registerUser(user));
            const response = unwrapResult(resultAction);

            if (response && response.success) {
                console.log("Registration successful. Navigating to OTP verification...");
                navigate('/verify-otp', { state: { username: email, password } });
            } else {
                console.error("Registration failed:", response.message);
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setShowAlert(true);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-300 p-4">
                <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">

                    <div className="w-full md:w-1/2 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl uppercase font-bold text-blue-700">Create an account</h2>
                            <p className="text-gray-500 mt-2">Enter your email and password to sign up</p>
                        </div>

                        {showAlert && (
                            <div
                                className="flex items-center p-4 mb-4 text-sm text-white bg-blue-500 rounded-lg shadow-md dark:bg-blue-600 dark:text-white"
                                role="alert">
                                <svg className="w-5 h-5 mr-3 text-white dark:text-gray-200" fill="currentColor"
                                     viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-4a1 1 0 011 1v3a1 1 0 01-2 0V7a1 1 0 011-1zm0 7a1 1 0 100 2 1 1 0 000-2z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <span className="font-medium">Info:</span> Please enter valid staff email
                            </div>
                        )}

                        <div className="space-y-6">
                            <AuthInputComponent id="email" type="email" placeholder="name@gmail.com" label="Your Email"
                                                onChange={(e) => setEmail(e.target.value)}/>
                            <AuthInputComponent id="password" type="password" placeholder="••••••••" label="Password"
                                                onChange={(e) => setPassword(e.target.value)}/>
                            <AuthButtonComponent type="submit" text="Register" onClick={handleSubmit}/>
                            <div className="space-y-3">
                                <button type="button" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <img src="src/assets/google-logo-24.png" className="mx-2" alt="google-logo"/>
                                    SIGN IN WITH GOOGLE
                                </button>
                            </div>

                            <p className="text-center text-sm text-gray-600"> Already have an account?{' '} <a
                                href="/signin" className="text-blue-600 font-semibold hover:text-blue-500"> Log in </a>
                            </p>
                        </div>
                    </div>

                    <AuthImageComponent src="src/assets/signup-img.png" alt="Sign Up Illustration"/></div>
            </div>
        </>
    );
};