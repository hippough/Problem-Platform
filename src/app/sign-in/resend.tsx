import { Input } from "@/components/ui/input"
import { signIn } from "../../../auth"
import { Button } from "@/components/ui/button"
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("resend", formData)
      }}
      className="space-y-4"
    >
      <Input type="text" name="email" placeholder="Email" />
      <Button type="submit" className="w-full">Sign in with Email</Button>
    </form>
  )
}