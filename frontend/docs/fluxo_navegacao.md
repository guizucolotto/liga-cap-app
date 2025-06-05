# Diagrama de Fluxo de Navegação

```mermaid
flowchart TD
    A[Início] --> B[Jogadores]
    A --> C[Times]
    A --> D[Estatísticas]
    A --> E[Login]
    A --> F[Registro]
    B --> G[Detalhes do Jogador]
    C --> H[Detalhes do Time]
    D --> I[Estatísticas Detalhadas]
    E --> J[Redirecionar para Registro]
    F --> J
    J --> E
    A --> K[Erro 404]