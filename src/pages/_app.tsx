import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange >
        <Component {...pageProps} />
      </ThemeProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
