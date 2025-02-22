import React, { useEffect, useState } from "react";
import { AuthImageComponent } from "../components/authentication/image/AuthImageComponent.tsx";
import { AuthButtonComponent } from "../components/authentication/button/AuthButtonComponent.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import {otpVerification, registerUser} from "../reducers/user-slice.ts";
import { useLocation, useNavigate } from "react-router-dom";
import {toast} from "sonner";

export const OTPVerificationPage = () => {
    const { loading, isAuthenticated, error } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [activeInput, setActiveInput] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { username, password } = location.state || {};

    const handleInputChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            setActiveInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim().split("");
        if (pasteData.length === otp.length) {
            setOtp(pasteData);
            setActiveInput(otp.length - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        dispatch(otpVerification({ user: { username, password }, otp: otpValue }));
    };

    const handleResendOTP = () => {
        toast.info("Resending OTP...");
        dispatch(registerUser({ username, password }));
    }


    useEffect(() => {
        if (isAuthenticated) {
            toast.info("User authenticated successfully");
            navigate("/dashboard");
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-300 p-4">
            <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
                <AuthImageComponent src="src/assets/otp-verify.png" alt="Sign In Illustration" />
                <div className="w-full md:w-1/2 p-8 mt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl uppercase font-bold text-blue-700">OTP Verification</h2>
                        <p className="text-gray-500 mt-2">Enter the OTP sent to your email</p>
                    </div>

                    {error && (
                        <div
                            className="flex items-center p-4 mb-4 text-sm text-white bg-red-500 rounded-lg shadow-md"
                            role="alert"
                        >
                            <svg
                                className="w-5 h-5 mr-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l1.414 1.414L10 13.414l2.293-2.293z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(e.target.value, index)}
                                    onFocus={() => setActiveInput(index)}
                                    onPaste={handlePaste}
                                    ref={(input) => index === activeInput && input?.focus()}
                                    className={`w-12 h-12 text-center border-2 rounded-md text-xl font-semibold ${
                                        activeInput === index ? "border-blue-500" : "border-gray-300"
                                    } focus:outline-none focus:border-blue-500`}
                                />
                            ))}
                        </div>

                        {loading && <p className="text-center text-blue-600">Verifying OTP...</p>}

                        <AuthButtonComponent
                            type="submit"
                            text="Verify"
                        />

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Didn't receive the OTP?{" "}
                            <button
                                onClick={handleResendOTP}
                                className="text-blue-600 font-semibold hover:text-blue-500"
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};