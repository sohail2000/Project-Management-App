import SignInForm from "~/components/form/SignInForm"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"


const signIn = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <Card className="w-2/6">
                <CardHeader>
                    <CardTitle className="text-center">Sign In</CardTitle>
                    <h2 className="text-xs text-slate-600">Test credentials</h2>
                    <p className="text-xs text-slate-600" >Username:  <span className="text-sm">sohail</span>  ,  Password:  <span className="text-sm">123456</span></p>
                </CardHeader>

                <CardContent>
                    <SignInForm />
                </CardContent>
            </Card>


        </div>
    )
}

export default signIn