import {AuthImageComponent} from "../components/image/AuthImageComponent.tsx";
import {AuthInputComponent} from "../components/input/AuthInputComponent.tsx";
import {AuthButtonComponent} from "../components/button/AuthButtonComponent.tsx";

export const UserSignInPage = () => {
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

                        <form className="space-y-6">
                            <AuthInputComponent id="email" type="email" placeholder="name@gmail.com" label="Your Email"/>
                            <AuthInputComponent id="password" type="password" placeholder="••••••••" label="Password"/>

                            <div className="text-right">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500"> Forgot
                                password
                                </a>
                            </div>

                            <AuthButtonComponent type="submit" text="Login"/>
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
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};