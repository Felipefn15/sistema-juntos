import { supabase } from "@/utils/supabaseClient";

// Fetch all patients
export const fetchPatients = async () => {
  const { data, error } = await supabase.from("paciente").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Create a new patient
export const createPatient = async (patientData: {
  nome: string;
  data_nascimento: string;
  contato: string;
  responsavel?: string;
}) => {
  const { nome, data_nascimento, contato, responsavel } = patientData;
  const { data, error } = await supabase
    .from("paciente")
    .insert([{ nome, data_nascimento, contato, responsavel }])
    .select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
