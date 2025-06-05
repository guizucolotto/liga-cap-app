# Gerenciamento Eficiente de Estado e Requisições de Dados

## Descrição
A aplicação utiliza um gerenciamento eficiente de estado para garantir que os dados sejam atualizados e acessíveis em toda a aplicação. Isso é feito através da biblioteca `@tanstack/react-query`, que facilita a manipulação de dados assíncronos.

## Implementação
- O gerenciamento de estado é centralizado, permitindo que diferentes componentes acessem e atualizem o estado global.
- As requisições de dados são feitas de forma assíncrona, garantindo que a interface do usuário permaneça responsiva.

## Funcionalidades
- **Cache de Dados**: Os dados são armazenados em cache, reduzindo a necessidade de requisições repetidas.
- **Atualizações em Tempo Real**: A aplicação pode ser configurada para atualizar automaticamente os dados em intervalos regulares.
- **Tratamento de Erros**: A biblioteca fornece mecanismos para lidar com erros de requisição de forma eficiente.

## Exemplos de Uso
```javascript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function Jogadores() {
  const { data, error, isLoading } = useQuery('jogadores', () =>
    axios.get('/api/jogadores').then(res => res.data)
  );

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <ul>
      {data.map(jogador => (
        <li key={jogador.id}>{jogador.nome}</li>
      ))}
    </ul>
  );
}