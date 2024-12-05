import React, { useState } from "react";
import { getSession } from "next-auth/react";

import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
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


const Appointment = () => {
  const [type, setType] = useState<string>("");

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-6 text-2xl font-semibold">Add Appointment</h1>
      <form className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Add a description"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block mb-2 text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="evolution">Evolution</option>
            <option value="anamnesis">Anamnesis</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Appointment;
