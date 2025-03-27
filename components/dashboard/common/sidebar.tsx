"use client"

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; 
import { Users, Network,  LayoutDashboard, Settings, BriefcaseBusiness, GraduationCap, School } from "lucide-react"; //CreditCard,
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from '@/assets/images/dashboard/common/logo.svg';
import { useUserStore } from "@/utils/store/user-store"; // Import the user store

export default function Sidebar() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const dashboardBorderColor = "border-sky-400"; // You can change this value dynamically
  const { user } = useUserStore();  


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => isMounted && pathname === path;
  // Function to check if a link should be displayed based on user type
  const canAccess = (types: string[]) => types.includes(user.type);

   return (
    <div className="hidden lg:flex fixed top-0 left-0 h-screen w-64 flex-col border-r bg-white z-10">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <Image src={logo} width={200} height={20} alt="logo" />
          <span className="text-xl font-bold" hidden>LEMO</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 py-2 overflow-y-auto">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 font-medium relative pl-9 border-l-4 rounded-none ${isActive('/dashboard') ? dashboardBorderColor : 'border-transparent'}`}
          asChild
        >
          <Link href="/dashboard" >
            <LayoutDashboard className="h-5 w-5 -ml-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
        {canAccess(['super_admin', 'admin', 'school_manager']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/students') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/students">
              <GraduationCap className="h-5 w-5 -ml-4" />
              <span>Manage Students</span>
            </Link>
          </Button>
        )}
        {canAccess(['school_manager']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/networks') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/networks">
              <Network className="h-5 w-5 -ml-4" />
              <span>Manage Networks</span>
            </Link>
          </Button>
        )}
        {/* {canAccess(['super_admin', 'admin']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/payments') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/payments">
              <CreditCard className="h-5 w-5 -ml-4" />
              <span>Payments</span>
            </Link>
          </Button>
        )} */}
        {canAccess(['school_manager']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/settings') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5 -ml-4" />
              <span>School Settings</span>
            </Link>
          </Button>
        )}
        {canAccess(['super_admin', 'admin']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/schools') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/schools">
              <School className="h-5 w-5 -ml-4" />
              <span>Manage Schools</span>
            </Link>
          </Button>
        )}
        {canAccess(['super_admin', 'admin', 'school_manager']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/staff') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/staff">
              <BriefcaseBusiness className="h-5 w-5 -ml-4" />
              <span>Manage Platform Staff</span>
            </Link>
          </Button>
        )}
        {canAccess(['super_admin']) && (
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-600 pl-9 relative border-l-4 rounded-none ${isActive('/dashboard/admins') ? dashboardBorderColor : 'border-transparent'}`}
            asChild
          >
            <Link href="/dashboard/admins">
              <Users className="h-5 w-5 -ml-4" />
              <span>Manage Admins</span>
            </Link>
          </Button>
        )}
      </nav>
    </div>
  );
}