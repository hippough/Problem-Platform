import { Toaster } from "sonner"
import Dashboard from "../../components/dashboard/dashboard"
import SessionProvider from "../../components/dashboard/SessionWrapper"

export default function loggedInPage(){
    return (
        <SessionProvider>
            <main>
                <Toaster />
                <Dashboard />
            </main>
        </SessionProvider>
        
    )
}