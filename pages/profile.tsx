import React from "react";
import "react-calendar/dist/Calendar.css";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Profile = () => {
    return (
      <div className="min-h-screen p-8 bg-gray-100">
        <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
        <div className="max-w-md mx-auto space-y-4">
          <p>Name: John Doe</p>
          <p>Contact: (123) 456-7890</p>
          <p>Email: john.doe@example.com</p>
          <p>Clinic Days: Monday, Wednesday, Friday</p>
        </div>
      </div>
    );
  };
  
  export default Profile;
  