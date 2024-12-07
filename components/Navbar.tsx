import Link from "next/link";
import LogoutButton from "./Logout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession(); // Get the session
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); // State for toggling menu
  const psicologaName = session?.user?.name?.split(' ')[0] || "";

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      {/* Mobile Navbar */}
      <nav className="lg:hidden bg-blue-500 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">JUNTOS - {psicologaName}</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? "✖" : "☰"} {/* Toggle between open/close icons */}
          </button>
        </div>
        {menuOpen && (
          <div className="flex flex-col mt-4 space-y-2">
            <Link
              href="/home"
              className={`block w-full text-left ${
                isActive("/home") ? "font-bold underline" : ""
              } hover:bg-blue-400 p-2 rounded`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/appointment"
              className={`block w-full text-left ${
                isActive("/appointment") ? "font-bold underline" : ""
              } hover:bg-blue-400 p-2 rounded`}
              onClick={() => setMenuOpen(false)}
            >
              Agendamento
            </Link>
            <Link
              href="/profile"
              className={`block w-full text-left ${
                isActive("/profile") ? "font-bold underline" : ""
              } hover:bg-blue-400 p-2 rounded`}
              onClick={() => setMenuOpen(false)}
            >
              Perfil
            </Link>
            <Link
              href="/patient"
              className={`block w-full text-left ${
                isActive("/patient") ? "font-bold underline" : ""
              } hover:bg-blue-400 p-2 rounded`}
              onClick={() => setMenuOpen(false)}
            >
              Pacientes
            </Link>
            {session && (
              <div className="pt-4">
                <LogoutButton />
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-blue-500 text-white flex-col items-start p-4">
        <h1 className="mb-8 text-2xl font-semibold">JUNTOS - {psicologaName}</h1>
        <Link
          href="/home"
          className={`mb-4 p-2 rounded w-full ${
            isActive("/home") ? "bg-blue-400 font-bold" : "hover:bg-blue-400"
          }`}
        >
          Home
        </Link>
        <Link
          href="/profile"
          className={`mb-4 p-2 rounded w-full ${
            isActive("/profile") ? "bg-blue-400 font-bold" : "hover:bg-blue-400"
          }`}
        >
          Perfil
        </Link>
        <Link
          href="/patient"
          className={`mb-4 p-2 rounded w-full ${
            isActive("/patient") ? "bg-blue-400 font-bold" : "hover:bg-blue-400"
          }`}
        >
          Pacientes
        </Link>
        {session && (
          <div className="mt-auto w-full">
            <LogoutButton />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
