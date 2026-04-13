# 📖 Story: Rastreamento Avançado e Automação PWA

Este documento registra a jornada de implementação do sistema de inteligência de dados e automação de marketing para o projeto GanhouBet PWA, servindo como base técnica para futuras atualizações.

---

## 🏗️ 1. Arquitetura do Sistema
O projeto foi estruturado para ser resiliente a bloqueadores de anúncios e garantir a máxima precisão de conversão.

*   **Front-end (Next.js)**: Páginas de "Loja" simuladas (iOS e Android) que capturam o lead.
*   **Camada de Dados (GTM)**: Eventos padronizados enviados via navegador.
*   **Camada de Servidor (CAPI)**: Disparos diretos para a API de Conversões do Facebook via Node.js.
*   **Persistência (Redis)**: Leads e configurações armazenados de forma ultra-rápida.
*   **Automação (Web Push)**: Funil de mensagens sequenciais via protocolo VAPID.

---

## 🛠️ 2. Marcos de Implementação

### Fase 1: Tracking de Navegador (GTM)
*   Configuração do GTM no PWA.
*   Implementação dos eventos: `ViewContent`, `InitiateCheckout`, `Lead` e `AddPaymentInfo`.
*   Padronização dos nomes para otimização do algoritmo do Facebook.

### Fase 2: Facebook CAPI & Deduplicação
*   Criação do utilitário `facebook-capi.js`.
*   Implementação do **`event_id`**: Gerado no front-end e enviado simultaneamente via Pixel e CAPI, permitindo que o Facebook deduplique os dados e evite inflação de métricas.
*   Integração do evento `Lead` (Inscrição de Push) como conversão de servidor.

### Fase 3: Inteligência TWR & Metadados
*   **Captura de TWR**: O sistema agora identifica e salva parâmetros dinâmicos (ex: `cwr`, `xid`, `campaign_name`) vindos do sistema de cloaking/redirecionamento.
*   **Campo Metadata**: Todos os dados da URL são persistidos no Redis vinculados ao assinante.

### Fase 4: Automação em Alta Frequência (Push)
*   **Migração de Tempo**: O motor de automação (`cron/route.js`) foi migrado de Horas para **Minutos**.
*   **Sequência Agressiva**: O primeiro push foi configurado para disparar em 5 minutos após a inscrição.
*   **Capacidade Ilimitada**: O funil processa múltiplas etapas sem restrições de quantidade.

---

## 💾 3. Estrutura de Arquivos Críticos

| Arquivo | Função |
| :--- | :--- |
| `config.json` | Configurações globais, Pixel IDs, Tokens e Mensagens. |
| `src/app/utils/facebook-capi.js` | Coração da Integração Server-side. |
| `src/app/store/[platform]/page.js` | Captura de UTMs, GTM e lógica de redirecionamento. |
| `src/app/api/push/cron/route.js` | Motor que varre o Redis e dispara as notificações. |
| `src/app/api/push/subscription/route.js` | Ponto de entrada que registra os leads e dispara o CAPI. |

---

## 🚦 4. Estado Atual: PRONTO PARA TRÁFEGO
*   ✅ Tracking GTM verificado.
*   ✅ CAPI com deduplicação configurado.
*   ✅ Captura de TWR Metadata ativa.
*   ✅ Funil de 5 minutos pronto.
*   ✅ Redirect com safety-delay de 500ms ativo.

---

> [!TIP]
> **Próxima Evolução Sugerida**: Implementar Webhooks de retorno da Casa de Apostas para parar a automação de "Depósito" assim que o usuário converter na plataforma.

**Documento finalizado em 13/04/2026.**
