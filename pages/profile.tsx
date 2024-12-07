// pages/profile.tsx

import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>You need to be logged in to view this page.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        <img src={session.user.image} alt={session.user.name} />
        {/* You can also show other user-related data here */}
      </div>
    </div>
  );
};

export default Profile;
