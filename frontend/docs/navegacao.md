# Navegação entre Páginas

## Descrição
A aplicação utiliza um sistema de roteamento para permitir a navegação entre diferentes páginas. Isso proporciona uma experiência de usuário fluida e intuitiva, permitindo que os usuários acessem rapidamente as informações desejadas.

## Implementação
- O roteamento é gerenciado pela biblioteca `react-router-dom`, que permite definir rotas para cada página da aplicação.
- As rotas são configuradas no arquivo principal de rotas, onde cada rota é associada a um componente específico.

## Funcionalidades
- **Navegação Dinâmica**: Os usuários podem navegar entre páginas sem recarregar a aplicação.
- **Histórico de Navegação**: O sistema mantém um histórico de navegação, permitindo que os usuários voltem para páginas anteriores facilmente.
- **Roteamento Aninhado**: Suporte para rotas aninhadas, permitindo uma estrutura de navegação mais complexa.

## Exemplos de Uso
```javascript
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/jogadores" component={JogadoresPage} />
        <Route path="/times" component={TimesPage} />
        <Route path="/estatisticas" component={EstatisticasPage} />
      </Switch>
    </Router>
  );
}