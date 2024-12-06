import { signIn, signOut, useSession } from "next-auth/react";

const Auth = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn("google")}>Sign In with Google</button>
    </div>
  );
};

export default Auth;
