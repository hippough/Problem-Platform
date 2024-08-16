"use server"

import { signIn } from "../../auth"
import { Button } from "./ui/button"
import { FcGoogle } from "react-icons/fc"
 
export async function SignInButtonGoogle() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/dashboard" })
      }}
    >
      <Button
      className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-300 gap-4"
      type="submit"
    >
      <FcGoogle />
      <span className="text-sm font-semibold text-gray-800">Log in with Google</span>
    </Button>
    </form>
  )
}
