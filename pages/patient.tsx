import { getSession } from "next-auth/react";

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
const Patient = () => {
    return (
      <div className="min-h-screen p-8 bg-gray-100">
        <h1 className="mb-6 text-2xl font-semibold">Patient Info</h1>
        <div className="max-w-md mx-auto space-y-4">
          <p>Name: Jane Smith</p>
          <p>Contact: (987) 654-3210</p>
          <p>Email: jane.smith@example.com</p>
        </div>
      </div>
    );
  };
  
  export default Patient;
  