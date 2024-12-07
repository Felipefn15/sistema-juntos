import { Patient } from "@/types";

// Utility function to handle the `GET` request to fetch all patients
export const fetchPatientsAPI = async () => {
    try {
      const response = await fetch("/api/paciente");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Utility function to handle `POST` request to add a new patient
  export const addPatientAPI = async (patientData: {
    nome: string;
    data_nascimento: string;
    contato: string;
    responsavel?: string;
  }) => {
    try {
      const response = await fetch("/api/paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error("Failed to add patient");
      const newPatient = await response.json();
      return newPatient[0]
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Update a patient
  export const updatePatientAPI = async (patient: Patient) => {
    const response = await fetch(`/api/paciente/${patient.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      throw new Error("Failed to update patient");
    }

    return await response.json();
  };
  
  // Utility function to handle the `POST` request to create an appointment
  import moment from "moment-timezone";

export const addAppointmentAPI = async (appointmentData: {
  psicologa_id: string;
  paciente_id: string;
  start_date: Date;
  end_date: Date;
}) => {
  try {
    //Convert start_date and end_date to UTC
    const startInUTC = moment(appointmentData.start_date)
      .tz("America/Sao_Paulo")
      .utc()
      .toISOString();
    const endInUTC = moment(appointmentData.end_date)
      .tz("America/Sao_Paulo")
      .utc()
      .toISOString();

    // Update the data to include UTC times
    const response = await fetch("/api/agendamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...appointmentData,
        start_date: startInUTC,
        end_date: endInUTC,
      }),
    });

    if (!response.ok) throw new Error("Failed to create appointment");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Utility function to handle the `GET` request to fetch all appointments
export const fetchAppointmentsAPI = async () => {
  try {
    const response = await fetch("/api/agendamento");
    if (!response.ok) throw new Error("Failed to fetch appointments");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteAppointmentAPI = async (appointmentId: string) => {
  try {
    const response = await fetch(`/api/agendamento/${appointmentId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete appointment");
    return await response.json(); // or some confirmation
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Utility function to add a new description
export const addDescriptionAPI = async ({ description, eventId }: { description: string, eventId: string }) => {
  const response = await fetch("/api/evolucao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description, eventId }),
  });

  if (!response.ok) {
    throw new Error("Failed to add description");
  }

  const data = await response.json();
  return data;
};

// Utility function to get descriptions for a specific event
export const getDescriptionsAPI = async (eventId: string) => {
  const response = await fetch(`/api/evolucao/${eventId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch descriptions");
  }

  const data = await response.json();
  return data;
};

// Utility function to delete a description
export const deleteDescriptionAPI = async (descriptionId: string) => {
  const response = await fetch("/api/evolucao", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ descriptionId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete description");
  }

  const data = await response.json();
  return data;
};
// Fetch psicologa by email
export const getPsicologaByEmail = async (email: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/psicologa?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      // If the psicologa is not found, return null instead of throwing an error
      return null;
    }

    if (!response.ok) {
      // For other non-successful status codes, throw an error
      throw new Error(`Failed to fetch psicologa: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching psicologa:", error);
    throw error;
  }
};

// Update existing psicologa
export const updatePsicologa = async (id: string, name: string, image: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/psicologa`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, image }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update psicologa: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating psicologa:", error);
    throw error;
  }
};

// Insert new psicologa
export const insertPsicologa = async (
  email: string,
  name: string,
  image: string,
  google_id: string
) => {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/psicologa`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, image, google_id, documento: "", contato: "" }),
    });

    if (!response.ok) {
      throw new Error(`Failed to insert psicologa: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error inserting psicologa:", error);
    throw error;
  }
};
