import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export const withAuth = (gssp?: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/",
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
          ...gsspData.props,
          session,
        },
      };
    }

    return { props: { session } };
  };
};
