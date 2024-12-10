import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";
import { Psicologa } from "@/types";

const Profile = () => {
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [psicologaData, setPsicologaData] = useState<Psicologa | null>();

  useEffect(() => {
    if (session) {
      setPsicologaData(session?.user?.psicologa);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  const handleProfileUpdate = (updatedPsicologa: Psicologa) => {
    setPsicologaData(updatedPsicologa); // Update the state with the new data
  };

  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Perfil</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Nome:</span>
          <span className="text-gray-600">{psicologaData?.nome || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-600">{psicologaData?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Documento:</span>
          <span className="text-gray-600">{psicologaData?.documento}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Contato:</span>
          <span className="text-gray-600">{psicologaData?.contato}</span>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Edit Profile
        </button>
      </div>
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          psicologa={psicologaData}
          onSave={handleProfileUpdate} // Pass the callback function
        />
      )}
    </div>
  );
};

export default Profile;
