import { auth } from "../../../auth";
import React from 'react'
import { redirect } from 'next/navigation';
import { SignIn } from "./resend";
import { SignInButtonGoogle } from "@/components/sign-in-button-google";

const page = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }


  return (

    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Sign in to Your Account
          </h2>
          <p className="text-sm text-center text-gray-600 mb-8">
            Sign in with your Google account
          </p>

          <SignInButtonGoogle />
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <SignIn />
        </div>
      </div>
      

    </>
      
  )
}

export default page
