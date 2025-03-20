import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/images/dashboard/common/logo.svg';
import authImg from '@/assets/images/auth/dashboard.png' 

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src={logo.src}
              width={200}
              height={200}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={authImg.src}
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
