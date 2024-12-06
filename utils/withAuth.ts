import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";

export const withAuth = (gssp?: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ session?: any }>> => {
    try {
      const session = await getSession(context);

      if (!session) {
        return {
          redirect: {
            destination: "/login", // Redirecting to the login page
            permanent: false,
          },
        };
      }

      // If there's a `gssp`, call it with the same context
      if (gssp) {
        const gsspData = await gssp(context);
        return {
          ...gsspData,
          props: {
            ...gsspData,
            session,
          },
        };
      }

      return { props: { session } }; // Returning the session as part of the props
    } catch (error) {
      console.error("Error fetching session:", error);
      return {
        redirect: {
          destination: "/error", // Redirect to an error page if something goes wrong
          permanent: false,
        },
      };
    }
  };
};
