import Link from "next/link";

const Navbar = () => {
  return (
    <>
    <nav className="flex lg:hidden items-center justify-between p-4 bg-blue-500 text-white">
      <Link href="/home">Home</Link>
      <Link href="/appointment">Appointment</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/patient">Patient</Link>
    </nav>
    <nav className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-blue-500 text-white flex-col items-start p-4">
      <h1 className="mb-8 text-2xl font-semibold">JUNTOS</h1>
      <Link href="/home" className="mb-4 hover:bg-blue-400 p-2 rounded w-full">
        Home
      </Link>
      <Link
        href="/appointment"
        className="mb-4 hover:bg-blue-400 p-2 rounded w-full"
      >
        Appointment
      </Link>
      <Link
        href="/profile"
        className="mb-4 hover:bg-blue-400 p-2 rounded w-full"
      >
        Profile
      </Link>
      <Link
        href="/patient"
        className="mb-4 hover:bg-blue-400 p-2 rounded w-full"
      >
        Patient
      </Link>
    </nav>
    </>
  );
};

export default Navbar;
