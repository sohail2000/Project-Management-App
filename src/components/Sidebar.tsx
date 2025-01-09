"use client";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useDashboardStore } from "~/store/dashboardStore";
import { LayoutGrid, List, LogOut, Moon, Sun, UserCircle, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Sidebar = () => {
  const { data: sessionData } = useSession();

  const { theme, setTheme } = useTheme();
  const { setBoardView, boardView } = useDashboardStore();

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/signin"
    });
  };

  return (
    <>
      {/* MOBILE MENU  */}
      <div className="sm:hidden flex justify-between items-center p-3 shadow-md bg-background  ">
        <div className="flex flex-row justify-center items-center gap-2">
          <Avatar className="h-8 w-8 bg-slate-200">
            <AvatarImage src="https://res.cloudinary.com/dydstvsbh/image/upload/v1735592029/ape_avatar_dm2znv.png" />
            <AvatarFallback>
              <UserCircle className="h-12 w-12 text-white" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold dark:text-white">{sessionData?.user.name}</h1>
        </div>
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HamburgerMenuIcon className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" space-y-2 p-4">
              <h1 className=" py-2 font-bold  border-b ">Menu</h1>
              <DropdownMenuItem asChild>
                <Button
                  variant={boardView == "list" ? "default" : "link"}
                  className="w-full justify-start gap-2"
                  onClick={() => setBoardView("list")}
                >
                  <List className=" h-4 w-4" />
                  List View
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  variant={boardView == "kanban" ? "default" : "link"}
                  onClick={() => setBoardView("kanban")}
                  className="w-full justify-start gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Kanban View
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="bg-red-400  dark:bg-red-600"
              >
                <LogOut className="mr-2 h-4 w-4 " />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* DESKTOP MENU  */}
      <div
        className={`bg-background  border-r shadow-sm transition-all max-sm:hidden w-52 md:w-64`}
      >
        <div className="flex flex-col h-full ">
          <div className="p-4 flex items-center justify-between">
            <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
              <Avatar className="h-8 w-8 bg-slate-200">
                <AvatarImage src="https://res.cloudinary.com/dydstvsbh/image/upload/v1735592029/ape_avatar_dm2znv.png" />
                <AvatarFallback>
                  <UserCircle className="h-12 w-12 text-white" />
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold dark:text-white">{sessionData?.user.name}</h1>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className={`flex-1 space-y-2 px-2`}>
            <Button
              variant={boardView == "list" ? "default" : "link"}
              className={`w-full gap-2 justify-start`}
              onClick={() => setBoardView("list")}
            >
              <List className=" h-4 w-4" />
              List View
            </Button>
            <Button
              variant={boardView == "kanban" ? "default" : "link"}
              className={`w-full gap-2 justify-start`}
              onClick={() => setBoardView("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
              Board View
            </Button>
          </nav>
          <div className="p-4 space-y-2 ">
            <Button
              variant={"secondary"}
              className="w-full"
              asChild
            >
              <Link href="/profile" >
                <UserRound className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>

            <Button
              onClick={handleLogout}
              variant={"destructive"}
              className=" w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
