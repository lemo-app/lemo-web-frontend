import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const VerificationSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6 animate-fade-in">
       
        <div className="flex justify-center">
          
          <Image
            src={"https://lemobucket.s3.eu-west-2.amazonaws.com/6.png"}
            width={100}
            height={20}
            alt="logo"
            className="transition-opacity duration-300"
          />
        </div>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Account Verified Successfully
        </h1>

        <p className="text-gray-600">
          Your LEMO account has been successfully verified. You can now access
          all features of the platform in your mobile app 🎉
        </p>
      </Card>
    </div>
  );
};

export default VerificationSuccessPage;
