import { auth } from "../../../auth";
import React from 'react'
import { redirect } from 'next/navigation';
import RegisterForm from './Form';
import LoginForm from './Form';

const page = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }


  return (

      <LoginForm/>

  )
}

export default page
