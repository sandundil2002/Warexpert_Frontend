import React, {useEffect, useState} from "react";
import { AuthImageComponent } from "../components/authentication/image/AuthImageComponent.tsx";
import { AuthButtonComponent } from "../components/authentication/button/AuthButtonComponent.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import {otpVerification} from "../reducers/user-slice.ts";
import {useLocation, useNavigate} from "react-router-dom";

export const OTPVerificationPage = () => {
    const { loading, isAuthenticated } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [activeInput, setActiveInput] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { username, password } = location.state || {};

    // Handle OTP input changes
    const handleInputChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            setActiveInput(index + 1);
        }
    };

    // Handle pasting OTP
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim().split("");
        if (pasteData.length === otp.length) {
            setOtp(pasteData);
            setActiveInput(otp.length - 1);
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");

        dispatch(otpVerification({ user: { username, password }, otp: otpValue }));
    };

    useEffect(() => {
        if (isAuthenticated) {
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
                            <a href="/resend-otp" className="text-blue-600 font-semibold hover:text-blue-500">
                                Resend OTP
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};