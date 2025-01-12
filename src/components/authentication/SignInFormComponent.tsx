export const SignInFormComponent = () => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-300 p-4">
                <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="w-1/2 hidden md:block">
                        <img
                            src="src/assets/loginsignup.png"
                            alt="Sign In Illustration"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="w-full md:w-1/2 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl uppercase font-bold text-blue-700">Sign In</h2>
                            <p className="text-gray-500 mt-2">Enter your email and password to sign in</p>
                        </div>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                                    Your Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@gmail.com"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="text-right">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                    Forgot password
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                Login
                            </button>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <img src="src/assets/google-logo-24.png" className="mx-2" alt="google-logo"/>
                                    SIGN IN WITH GOOGLE
                                </button>
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                Not registered?{' '}
                                <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-500">
                                    Create account
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
