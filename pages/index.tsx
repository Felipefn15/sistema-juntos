import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <div className="flex flex-col items-center w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-gray-700">
          Bem-vindo ao <span className="text-blue-500">Juntos</span>
        </h1>
        <p className="mb-8 text-gray-500">
        Por favor acesse sua conta para continuar
        </p>
        <button
          onClick={() => signIn("google")}
          className="flex items-center px-6 py-3 text-lg font-medium text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600"
        >
          <svg
            className="w-6 h-6 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.15 0 6.01 1.15 8.25 3.04l6.1-6.1C34.95 3.35 29.8 1.5 24 1.5 14.55 1.5 6.4 6.85 3.15 14.25l7.7 6c1.55-5 6.2-8.75 11.9-8.75z"
            />
            <path
              fill="#34A853"
              d="M46.35 24.5c0-1.5-.15-3-.4-4.5H24v9h12.9c-.6 3-2.6 5.5-5.4 7.15l7.75 6c4.5-4.15 7.1-10.3 7.1-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M11.4 28.15c-.6-1.8-.9-3.75-.9-5.65 0-2 .3-3.95.9-5.75l-7.75-6c-1.65 3.3-2.65 7.05-2.65 11.75s1 8.45 2.65 11.75l7.75-6z"
            />
            <path
              fill="#4285F4"
              d="M24 46.5c6.3 0 11.6-2.05 15.45-5.55l-7.75-6c-2.15 1.45-4.9 2.3-7.7 2.3-5.7 0-10.4-3.75-11.9-8.8l-7.7 6c3.25 7.4 11.4 12.75 20.85 12.75z"
            />
          </svg>
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default Login;
