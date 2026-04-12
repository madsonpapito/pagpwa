# Plano de Conversão Real: PWA -> Link da Casa

O usuário deseja que o PWA não apenas simule o download, mas execute as tarefas de marketing (notificações) e entregue o usuário pronto para a casa de apostas.

## Mudanças Propostas

### 1. Integração de Notificações reativas
- Nas páginas `ios/page.js` e `android/page.js`, ao atingir 100% de progresso, chamaremos `Notification.requestPermission()`.
- Isso aproveita o "momento de intenção" do usuário para garantir o máximo de inscritos no Web Push.

### 2. Redirecionamento para a Casa (Link de Afiliado)
- Substituir o redirecionamento interno (`window.location.href = '/'`) pelo redirecionamento externo para o `affiliateLink` definido no `config.json`.
- Buscaremos este link via API no momento da montagem da página.

### 3. Guia de Instalação iOS (Standalone)
- Como o iOS exige instalação manual para Push, adicionaremos um pequeno aviso visual após os 100% instruindo o usuário a usar o botão "Compartilhar" para ativar o bônus.

## Plano de Verificação

### Fluxo de Teste
1. Usuário clica em "OBTER".
2. Barra preenche até 100%.
3. O navegador solicita permissão de notificações.
4. Após a resposta (Permitir/Negar), o navegador abre o link da Ganhou.bet.

**Podemos seguir com esta atualização?** 🎰🚀🔗✅
