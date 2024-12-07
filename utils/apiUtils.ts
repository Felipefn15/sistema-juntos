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
      return newPatient
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  // Utility function to handle the `POST` request to create an appointment
  export const addAppointmentAPI = async (appointmentData: {
    psicologa_id: string;
    paciente_id: string;
    start_date: Date;
    end_date: Date;
  }) => {
    try {
      const response = await fetch("/api/agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
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