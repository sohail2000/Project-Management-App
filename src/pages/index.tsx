import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { UserCircle, ArrowRight, Rocket } from "lucide-react";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Project Management App</title>
        <meta name="description" content="Streamline your projects with ease!" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-6">
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Welcome to Project Management App
            </CardTitle>
            <CardDescription className="text-lg text-gray-200">
              Manage your projects seamlessly and collaborate with your team efficiently.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center space-y-6 pt-6">
            {sessionData ? (
              <div className="text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20 bg-slate-200">
                    <AvatarImage src="https://res.cloudinary.com/dydstvsbh/image/upload/v1735592029/ape_avatar_dm2znv.png" />
                    <AvatarFallback>
                      <UserCircle className="h-12 w-12 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-semibold text-white">
                    Hello, {sessionData.user.name}!
                  </h2>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant={"outline"}
                  className=" font-semibold"
                >
                  <Link href="/project" className="inline-flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Please Sign In to access your dashboard
                  </h2>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="font-semibold"
                >
                  <Link href="/signin" className="inline-flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-6 pb-4 text-center">
            <p className="text-sm text-gray-300 w-full">
              © {new Date().getFullYear()} Project Management App. All Rights Reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}