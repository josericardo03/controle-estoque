export interface ErrorInfo {
  isDuplicate: boolean;
  title: string;
  message: string;
  details?: string;
}

export function detectDuplicateError(error: unknown): ErrorInfo {
  // Verificar se é um erro de resposta HTTP (estrutura padrão do Axios)
  if (error && typeof error === "object" && "response" in error) {
    const httpError = error as { response: { data: any; status: number } };
    const errorData = httpError.response.data;
    const errorMessage = errorData.message || errorData.error || "";
    const statusCode = httpError.response.status;

    console.log(
      "Erro HTTP detectado - Status:",
      statusCode,
      "Mensagem:",
      errorMessage
    );

    // Erros de duplicação geralmente retornam 400 (Bad Request) ou 409 (Conflict)
    if (statusCode === 400 || statusCode === 409) {
      const message = errorMessage.toLowerCase();

      // Detectar CPF duplicado
      if (
        message.includes("cpf") &&
        (message.includes("já existe") ||
          message.includes("duplicado") ||
          message.includes("already exists") ||
          message.includes("já cadastrado"))
      ) {
        return {
          isDuplicate: true,
          title: "CPF Já Cadastrado",
          message: "Este CPF já está cadastrado em nossa base de dados.",
          details: errorMessage,
        };
      }

      // Detectar CNPJ duplicado
      if (
        message.includes("cnpj") &&
        (message.includes("já existe") ||
          message.includes("duplicado") ||
          message.includes("already exists") ||
          message.includes("já cadastrado"))
      ) {
        return {
          isDuplicate: true,
          title: "CNPJ Já Cadastrado",
          message: "Este CNPJ já está cadastrado em nossa base de dados.",
          details: errorMessage,
        };
      }

      // Detectar código de barras duplicado
      if (
        (message.includes("código") ||
          message.includes("codigo") ||
          message.includes("barra") ||
          message.includes("codigobarra")) &&
        (message.includes("já existe") ||
          message.includes("duplicado") ||
          message.includes("already exists") ||
          message.includes("já cadastrado"))
      ) {
        return {
          isDuplicate: true,
          title: "Código de Barras Já Cadastrado",
          message:
            "Este código de barras já está cadastrado em nossa base de dados.",
          details: errorMessage,
        };
      }

      // Detectar email duplicado
      if (
        message.includes("email") &&
        (message.includes("já existe") ||
          message.includes("duplicado") ||
          message.includes("already exists") ||
          message.includes("já cadastrado"))
      ) {
        return {
          isDuplicate: true,
          title: "Email Já Cadastrado",
          message: "Este email já está cadastrado em nossa base de dados.",
          details: errorMessage,
        };
      }

      // Detectar nome duplicado (para produtos)
      if (
        message.includes("nome") &&
        (message.includes("já existe") ||
          message.includes("duplicado") ||
          message.includes("already exists") ||
          message.includes("já cadastrado"))
      ) {
        return {
          isDuplicate: true,
          title: "Produto Já Cadastrado",
          message:
            "Um produto com este nome já está cadastrado em nossa base de dados.",
          details: errorMessage,
        };
      }

      // Detectar qualquer erro 400/409 que contenha palavras de duplicação
      if (
        message.includes("já existe") ||
        message.includes("duplicado") ||
        message.includes("already exists") ||
        message.includes("já cadastrado") ||
        message.includes("duplicate")
      ) {
        return {
          isDuplicate: true,
          title: "Registro Já Existe",
          message: "Este registro já está cadastrado em nossa base de dados.",
          details: errorMessage,
        };
      }
    }
  }

  // Verificar se é um erro do Axios com estrutura diferente
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as any;
    if (axiosError.response) {
      const errorData = axiosError.response.data;
      const errorMessage = errorData.message || errorData.error || "";
      const statusCode = axiosError.response.status;

      if (statusCode === 400 || statusCode === 409) {
        const message = errorMessage.toLowerCase();

        // Aplicar as mesmas verificações de duplicação
        if (
          message.includes("já existe") ||
          message.includes("duplicado") ||
          message.includes("already exists") ||
          message.includes("já cadastrado") ||
          message.includes("duplicate")
        ) {
          return {
            isDuplicate: true,
            title: "Registro Já Existe",
            message: "Este registro já está cadastrado em nossa base de dados.",
            details: errorMessage,
          };
        }
      }
    }
  }

  // Verificar se é um erro genérico com mensagem de duplicação
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("já existe") ||
      message.includes("duplicado") ||
      message.includes("already exists") ||
      message.includes("já cadastrado") ||
      message.includes("duplicate") ||
      message.includes("400") ||
      message.includes("409")
    ) {
      return {
        isDuplicate: true,
        title: "Registro Já Existe",
        message: "Este registro já está cadastrado em nossa base de dados.",
        details: error.message,
      };
    }
  }

  // Se não for um erro de duplicação conhecido, retornar erro genérico
  return {
    isDuplicate: false,
    title: "Erro",
    message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
    details: error instanceof Error ? error.message : "Erro desconhecido",
  };
}
