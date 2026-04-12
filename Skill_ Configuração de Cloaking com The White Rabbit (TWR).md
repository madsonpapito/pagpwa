# Skill: Configuração de Cloaking com The White Rabbit (TWR)

Esta skill fornece instruções detalhadas para configurar o **The White Rabbit (TWR)** como um escudo de tráfego (cloaker) em campanhas de iGaming, especialmente integradas com PWAs e GTM.

---

## 1. Configuração Inicial de Domínio (CNAME)

Para utilizar o TWR, você deve primeiro apontar o seu domínio/subdomínio para os servidores deles.

### **Passo a Passo:**
1.  **Acesse o Painel DNS**: No seu provedor (Cloudflare, Hostinger, GoDaddy, etc.).
2.  **Crie um Registro CNAME**:
    - **Tipo**: `CNAME`
    - **Nome/Host**: `www` ou o seu subdomínio (ex: `app`, `play`, `giros`).
    - **Destino/Target**: `connect.domains-twr.com`
3.  **Cloudflare (Importante)**: Se usar Cloudflare, o ícone de nuvem (Proxy) deve estar **DESATIVADO** (apenas DNS).
4.  **Validação**: No painel do TWR, adicione o domínio e aguarde o status "Verificado".

---

## 2. Criação de Campanha de Cloaking

O TWR separa o tráfego em dois caminhos: **Safe Page** (para robôs/revisores) e **Offer Page** (para jogadores reais).

### **Configurações Essenciais:**
- **Traffic Source**: Selecione a plataforma (TikTok, Facebook, Google Ads, etc.). Isso ajusta os parâmetros automáticos.
- **Safe Page (Página Segura)**: URL da sua landing page "branca" que cumpre todas as políticas da rede de anúncios.
- **Offer Page (Página de Oferta)**: URL do seu PWA ou link direto da GanhouBet.
- **Redirect Method**: Recomenda-se manter o padrão do sistema para máxima segurança.
- **Filtragem (Targeting)**: Ative apenas os países e dispositivos (Mobile/Desktop) que deseja que vejam a oferta real.

---

## 3. Integração com Trackers e Parâmetros (GTM/Pixel)

Para que o rastreamento de conversões funcione corretamente, você deve concatenar os parâmetros do TWR com os seus.

### **Como concatenar:**
1.  **Copie os Parâmetros do TWR**: Ex: `cwr=123&cname=campanha`.
2.  **Copie os seus Parâmetros (GTM/Pixel)**: Ex: `utm_source=tiktok&pixel=abc`.
3.  **Combine com `&`**: A URL final no anúncio deve ser:
    `https://seu-dominio.com/?cwr=123&cname=campanha&utm_source=tiktok&pixel=abc`

---

## 4. Estratégia Avançada para PWA

Ao usar o TWR com o seu PWA próprio:
1.  **Lander de Instalação**: Esta deve ser a sua **Offer Page** no TWR.
2.  **Fluxo de Aprovação**: Durante a fase de análise do anúncio, o TWR enviará os robôs para a **Safe Page**. Após a aprovação, os usuários reais verão a sua Lander de Instalação do PWA.
3.  **Segurança de Notificações**: Como o PWA está sob o domínio verificado no TWR, o cloaking protege inclusive os scripts de notificação push de serem detectados prematuramente.

---

## 5. Checklist de Verificação (Troubleshooting)
- [ ] O domínio está com status "Verificado" no painel TWR?
- [ ] O proxy do Cloudflare está desligado (nuvem cinza)?
- [ ] A Safe Page está acessível e de acordo com as políticas?
- [ ] Os parâmetros no anúncio estão separados corretamente por `&`?
- [ ] O targeting de país no TWR coincide com o targeting do anúncio?

---

## Referências
- [Documentação Oficial TWR Helpdesk](https://help.thewhiterabbit.app/en/)
- [Guia de Registro de Domínio TWR](https://help.thewhiterabbit.app/en/article/how-to-register-a-domain-in-the-white-rabbit-complete-step-by-step-guide-8jdgcf/)
- [Guia de Integração com Trackers](https://help.thewhiterabbit.app/en/article/how-to-integrate-the-white-rabbit-with-any-tracking-tool-4lazpd/)
