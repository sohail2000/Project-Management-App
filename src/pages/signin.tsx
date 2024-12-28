import Link from "next/link"
import SignInForm from "~/components/form/SignInForm"
import {
    Card,
    CardContent,
    CardFooter,
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
                <CardFooter>
                    <p className='text-center text-sm text-gray-600 mt-2'>
                        If you don&apos;t have an account, please&nbsp;
                        <Link className='text-blue-500 hover:underline' href='/sign-up'>
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>


        </div>
    )
}

export default signIn