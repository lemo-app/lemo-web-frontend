"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Adjust the import path as necessary
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Adjust the import path as necessary
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Menu,
  User,
  ChevronRight,
} from "lucide-react";
import avatarLogo from "@/assets/images/dashboard/common/avatar.png";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/utils/store/user-store";
import { ProfileModal } from "./profile-modal";
import { useSidebarStore } from "./sidebar";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userData = useUserStore((state) => state.user); // Get the user data from the store
  const isProfileCompleted = useUserStore((state) => state.isProfileCompleted); // Get the isProfileCompleted state from the store
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(userData, " userStoreData");
  console.log(isProfileCompleted, " isProfileCompleted");

  useEffect(() => {
    if (!isProfileCompleted) {
      setIsModalOpen(true);
    }
  }, [isProfileCompleted]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Clear the token from cookies
    router.push("/login");
  };

  // Generate breadcrumb segments from pathname
  const generateBreadcrumbs = (): { name: string; path: string }[] => {
    if (!pathname) return [];

    // Remove leading slash and split by '/'
    const pathSegments = pathname.split("/").filter((segment) => segment);

    // Format path segments into readable text
    return pathSegments.map((segment, index) => {
      // Build the path up to this segment
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

      // Format the segment name (capitalize, replace hyphens with spaces)
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { name, path };
    });
  };

  const breadcrumbs = generateBreadcrumbs();
  const { toggleCollapse } = useSidebarStore();

  return (
    <header className="flex h-14 items-center justify-between bg-white pe-6 sticky top-0 z-10">
     <div className="flex items-center gap-2 ms-2">
     <div className="lg:hidden ">
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      <div className="flex items-center ">
          {breadcrumbs.length > 0 &&
            breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.path}>
                <span
                  className={`${
                    index === breadcrumbs.length - 1
                      ? "font-medium text-primary"
                      : "text-gray-600"
                  }`}
                >
                  {breadcrumb.name}
                </span>
                {index !== breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
                )}
              </React.Fragment>
            ))}
        </div>
     </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative border-[1px]">
          <Bell className="h-6 w-6" />
          {/* <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs text-white">
            2
          </span> */}
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsModalOpen(true)}
          className="relative h-10 p-3 rounded-md flex items-center gap-2 border-gray-100 border-2"
        >
          {userData.avatar_url ? (
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={userData.avatar_url ?? avatarLogo.src}
                alt="User image"
              />
              <AvatarFallback>{userData.full_name ?? "U"}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="size-5" />
          )}

          <div className="md:flex flex-col items-start text-xs hidden">
            <span className="font-medium">
              {userData?.full_name ?? "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              {userData?.type?.replace("_", " ").toLocaleUpperCase()}
            </span>
          </div>
        </Button>
      </div>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
      />
    </header>
  );
};

export default Header;
