# 🍝 Massas La Bella - Fábrica de Massas Artesanais

<div align="center">
  <img src="img/logo.webp" alt="Logo Massas La Bella" width="200">
  <br><br>
  
  [![JS Stack](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com)
  [![Animation](https://img.shields.io/badge/GSAP-3.x-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/)
  [![SEO Optimized](https://img.shields.io/badge/SEO-Otimizado-C53B34?style=flat-square&logo=google)](https://github.com)
</div>

---

## 🎯 Sobre o Projeto

Site institucional multi-page desenvolvido para a **Massas La Bella**, uma fábrica de massas artesanais localizada em **Petrópolis, RJ**. O projeto possui uma estrutura modular com páginas integradas para a história da marca, catálogo de produtos e formulário de contato, atendendo a fluxos específicos de branding institucional, vendas B2C e captação de parcerias B2B.

---

## 🚀 Implementações Técnicas

### 1. Sistema de Animações com GSAP
* **Físicas de Transição Unificadas**: Todas as animações ativadas por scroll (títulos, parágrafos, imagens de ingredientes, botões e cards) compartilham a curva física `elastic.out(1, 0.75)` para manter a consistência de movimento em toda a navegação.
* **SplitText Nativo em Vanilla JS**: Implementação de um algoritmo próprio em JavaScript puro para desmembrar dinamicamente strings em caracteres e animar suas entradas em fluxo progressivo (*stagger*), dispensando dependências de plugins pagos.
* **Transição Elástica em Botões**: Efeitos elásticos e oscilações de escala baseados na interação real do cursor nos estados de `mouseenter`, `mouseleave`, `mousedown` e `mouseup`.

### 2. Layout Responsivo & CSS
* **Ajuste de SVG Ondulado (Mobile)**: Para preservar a curvatura suave e fluida do topo da seção Hero sem achatar o vetor em telas pequenas, o SVG foi configurado para vazar horizontalmente da viewport (`width: 175%`) utilizando `object-fit: fill`. Isso evita distorções verticais nos bicos das ondas sem gerar rolagem horizontal no contêiner pai.
* **Alinhamento e Proporções Simétricas**: Seção de parcerias B2B estruturada com limites fixos de largura (`480px` para copy e `440px` para imagem) combinados com margens externas simétricas para equilíbrio visual.
* **Otimização de Sliders**: Carrossel de depoimentos otimizado com setas direcionais em posicionamento absoluto nas extremidades laterais, maximizando o espaço útil para textos em todas as resoluções de tela.

### 3. Desempenho e Aceleração
* **Renderização via Hardware**: Uso estratégico da propriedade `will-change` em contêineres dinâmicos para delegar o processamento visual à GPU, assegurando taxas de quadro de **60 FPS** em aparelhos móveis.
* **Formato WebP**: Compressão de todos os ativos de imagem pesados para o padrão `.webp` para acelerar o tempo de carregamento inicial.

### 4. SEO Semântico & Dados Estruturados
* **Semântica HTML5**: Emprego estrito de tags estruturais como `<main>`, `<section>`, `<article>`, `<header>` e `<footer>`.
* **Marcação Schema JSON-LD**: Marcação estruturada completa incorporando as entidades `FoodEstablishment` e `LocalBusiness` para impulsionar a indexação regional e a relevância em motores de busca locais em Petrópolis.

---

## 🛠️ Stack Tecnológica

* **Estrutura**: HTML5 Semântico
* **Estilização**: CSS3 (CSS Variables, Flexbox, Grid, Media Queries)
* **Lógica e Interatividade**: Vanilla JS (ES6+)
* **Animações**: GSAP (GreenSock Animation Platform) & ScrollTrigger
* **Dados e Metadados**: Schema JSON-LD, Open Graph & Twitter Cards
* **Otimização de Mídia**: WebP format

---

## 📁 Estrutura do Projeto

```bash
├── css/                  # Estilos adicionais
├── img/                  # Ativos visuais (WebP e SVG)
├── index.html            # Página institucional principal (Home)
├── produtos.html         # Página de catálogo de produtos
├── sobre-nos.html        # Página da história institucional da fábrica
├── style.css             # Estilos gerais e consultas de mídia responsivas
├── main.js               # Animações de scroll (GSAP) e lógica de interface
└── README.md             # Documentação técnica do projeto
```

---

<div align="center">
  <p>Desenvolvido por <strong>Enzo Canedo</strong>. 🇮🇹✨</p>
</div>
