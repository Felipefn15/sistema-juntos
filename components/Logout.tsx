import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
