# Carregamento Assíncrono de Componentes

## Descrição
A aplicação implementa o carregamento assíncrono de componentes para melhorar o desempenho e a experiência do usuário. Isso permite que os componentes sejam carregados apenas quando necessários, reduzindo o tempo de carregamento inicial da aplicação.

## Implementação
- O carregamento assíncrono é realizado utilizando a função `React.lazy()` em conjunto com `Suspense` do React.
- Os componentes são divididos em módulos, permitindo que apenas os módulos necessários sejam carregados.

## Funcionalidades
- **Redução do Tempo de Carregamento**: Componentes não são carregados até que sejam realmente necessários, melhorando o tempo de resposta da aplicação.
- **Feedback Visual**: Um componente de carregamento pode ser exibido enquanto o componente assíncrono está sendo carregado.

## Exemplos de Uso
```javascript
import React, { Suspense, lazy } from 'react';

const JogadoresPage = lazy(() => import('./pages/JogadoresPage'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <JogadoresPage />
    </Suspense>
  );
}