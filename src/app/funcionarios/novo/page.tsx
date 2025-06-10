"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormLayout,
  FormSection,
  FormField,
} from "@/Components/ui/form-layout";
import { InputMask } from "@/Components/ui/input-mask";
import { SelectInput } from "@/Components/ui/select";
import { Breadcrumb } from "@/Components/ui/breadcrumb";

// Tipo para os dados do formulário
interface FormData {
  // Dados Pessoais
  nome: string;
  email: string;
  telefone: string;
  cpf: string;

  // Endereço
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;

  // Dados Profissionais
  cargo: string;
  departamento: string;
  salario: string;
}

export default function NovoFuncionarioPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<FormData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Opções para o select de estados
  const estados = [
    { value: "SP", label: "São Paulo" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "MG", label: "Minas Gerais" },
  ];

  // Opções para o select de departamentos
  const departamentos = [
    { value: "TI", label: "Tecnologia da Informação" },
    { value: "RH", label: "Recursos Humanos" },
    { value: "FIN", label: "Financeiro" },
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulando uma requisição
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Dados do formulário:", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            {
              label: "Funcionários",
              href: "/funcionarios",
            },
            {
              label: "Novo Funcionário",
              href: "/funcionarios/novo",
              active: true,
            },
          ]}
        />
      </div>

      {/* Formulário */}
      <FormProvider {...methods}>
        <FormLayout
          title="Cadastro de Funcionário"
          description="Preencha os dados do novo funcionário"
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
        >
          {/* Seção de Dados Pessoais */}
          <FormSection
            title="Dados Pessoais"
            description="Informações básicas do funcionário"
          >
            <FormField label="Nome Completo" error={errors.nome?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o nome completo"
                {...register("nome", { required: "Nome é obrigatório" })}
              />
            </FormField>

            <FormField label="E-mail" error={errors.email?.message}>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o e-mail"
                {...register("email", { required: "E-mail é obrigatório" })}
              />
            </FormField>

            <FormField label="Telefone" error={errors.telefone?.message}>
              <InputMask
                name="telefone"
                mask="telefone"
                placeholder="(00) 00000-0000"
              />
            </FormField>

            <FormField label="CPF" error={errors.cpf?.message}>
              <InputMask name="cpf" mask="cpf" placeholder="000.000.000-00" />
            </FormField>
          </FormSection>

          {/* Seção de Endereço */}
          <FormSection
            title="Endereço"
            description="Informações de localização"
          >
            <FormField label="CEP" error={errors.cep?.message}>
              <InputMask name="cep" mask="cep" placeholder="00000-000" />
            </FormField>

            <FormField label="Número" error={errors.numero?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o número"
                {...register("numero")}
              />
            </FormField>

            <FormField
              label="Endereço"
              error={errors.endereco?.message}
              fullWidth
            >
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o endereço"
                {...register("endereco", {
                  required: "Endereço é obrigatório",
                })}
              />
            </FormField>

            <FormField label="Complemento" error={errors.complemento?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o complemento"
                {...register("complemento")}
              />
            </FormField>

            <FormField label="Bairro" error={errors.bairro?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o bairro"
                {...register("bairro", { required: "Bairro é obrigatório" })}
              />
            </FormField>

            <FormField label="Cidade" error={errors.cidade?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite a cidade"
                {...register("cidade", { required: "Cidade é obrigatória" })}
              />
            </FormField>

            <FormField label="Estado" error={errors.estado?.message}>
              <SelectInput
                name="estado"
                options={estados}
                placeholder="Selecione o estado"
              />
            </FormField>
          </FormSection>

          {/* Seção de Dados Profissionais */}
          <FormSection
            title="Dados Profissionais"
            description="Informações do cargo e remuneração"
          >
            <FormField label="Cargo" error={errors.cargo?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o cargo"
                {...register("cargo", { required: "Cargo é obrigatório" })}
              />
            </FormField>

            <FormField
              label="Departamento"
              error={errors.departamento?.message}
            >
              <SelectInput
                name="departamento"
                options={departamentos}
                placeholder="Selecione o departamento"
              />
            </FormField>

            <FormField label="Salário" error={errors.salario?.message}>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o salário"
                {...register("salario", { required: "Salário é obrigatório" })}
              />
            </FormField>
          </FormSection>
        </FormLayout>
      </FormProvider>
    </div>
  );
}
