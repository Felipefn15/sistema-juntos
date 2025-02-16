import type React from "react"
import Navbar from "./Navbar"
import { User } from "next-auth"
import Image from "next/image"

interface HeaderProps {
  user: User
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  console.log({user})
  return (
    <>
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-8">Juntos</h1>
          
        </div>
        <div className="flex items-center gap-5">
          <Image src={user?.image ?? ''} alt="Profile" className="w-10 h-10 rounded-full" width={40} height={40} />
          <Navbar />

        </div>
      </header>
    </>
  )
}

export default Header

