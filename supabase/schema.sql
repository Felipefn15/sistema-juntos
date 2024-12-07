-- Psicologa Table
CREATE TABLE psicologa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    documento TEXT NOT NULL,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    contato TEXT NOT NULL
);

-- Paciente Table
CREATE TABLE paciente (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    idade INT NOT NULL,
    contato TEXT NOT NULL
);

-- Agendamento Table
CREATE TABLE agendamento (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    paciente_id UUID REFERENCES paciente(id) ON DELETE CASCADE,
    psicologa_id UUID REFERENCES psicologa(id) ON DELETE CASCADE
);

-- Evolucao Table
CREATE TABLE evolucao (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descricao TEXT NOT NULL,
    agendamento_id UUID REFERENCES agendamento(id) ON DELETE CASCADE
);

-- Pagamento Table
CREATE TABLE pagamento (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    pago BOOLEAN NOT NULL,
    agendamento_id UUID REFERENCES agendamento(id) ON DELETE CASCADE
);

-- AgendamentoPagamento Table
CREATE TABLE agendamento_pagamento (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agendamento_id UUID REFERENCES agendamento(id) ON DELETE CASCADE,
    pagamento_id UUID REFERENCES pagamento(id) ON DELETE CASCADE
);
