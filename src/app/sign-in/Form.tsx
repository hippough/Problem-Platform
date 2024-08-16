import React from "react";
import { SignInButtonGoogle } from "../../components/sign-in-button-google";

const LoginForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Sign in to Your Account
        </h2>
        <p className="text-sm text-center text-gray-600 mb-8">
          Sign in with your Google account to access your account.
        </p>

        <SignInButtonGoogle />
      </div>
    </div>
  );
};

export default LoginForm;
