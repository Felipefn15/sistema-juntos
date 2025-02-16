"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "./Logout"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const psicologaName = session?.user?.name?.split(" ")[0] || ""

  const isActive = (path: string) => router.pathname === path

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/appointment", label: "Agendamento" },
    { href: "/profile", label: "Perfil" },
    { href: "/patient", label: "Pacientes" },
    { href: "/pagamento-historico", label: "Histórico de Pagamento" },
  ]

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-blue-500 focus:outline-none z-50"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Responsive Navbar */}
      <nav
        className={`fixed inset-y-0 left-0 z-40 w-full bg-gray-800 bg-opacity-50 text-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'
        }`}
      >
        <div
            className={`z-40 w-64 bg-blue-500 text-white p-4 `}
        >
          <div className="flex flex-col h-full">
            <h1 className="mb-8 text-2xl font-semibold">JUNTOS - {psicologaName}</h1>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-4 p-2 rounded w-full ${
                  isActive(item.href) ? "bg-blue-400 font-bold" : "hover:bg-blue-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session && (
              <div className="mt-auto w-full">
                <LogoutButton />
              </div>
            )}
          </div>
          </div>
      </nav>
    </>
  )
}

export default Navbar
