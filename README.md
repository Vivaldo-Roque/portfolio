# Vivaldo Roque — Portfólio Pessoal (Guia de Manutenção Solo)

Este projeto foi estruturado sob os princípios de **Clean Code** e **Single Source of Truth (Fonte Única de Verdade)** para que possas atualizar textos, adicionar projetos, editar tecnologias ou mudar dados pessoais sem precisar de IA nem de mexer na lógica interna de React/Three.js.

---

## 1. Mapa da Arquitetura (`src/`)

```text
src/
├── assets/                  # Imagens estáticas empacotadas pelo Vite (retrato, textura)
├── config/                  # ★ DADOS ESTRUTURADOS E CONFIGURAÇÕES CENTRAIS
│   ├── profile.ts           # Nome, email, telefone, WhatsApp, links sociais e CVs
│   ├── skills-data.ts       # Lista das tuas tecnologias, ícones Devicon, tier e projetos associados
│   ├── origin-data.ts       # Estrutura da linha temporal (Académico, Experiência, Certificações)
│   └── about-data.ts        # Estrutura das 4 paragens da caminhada pelo globo 3D
├── content/
│   └── projects/            # ★ FICHEIROS YAML DOS PROJETOS (1 ficheiro = 1 projeto)
│       ├── _TEMPLATE.yaml   # Modelo pronto a copiar para adicionares novos projetos
│       ├── 01-cfop-trainer.yaml
│       └── ...
├── locales/                 # ★ TEXTOS E TRADUÇÕES (PT e EN)
│   ├── pt/                  # Textos em Português (about, common, contact, hero, origin, projects, skills)
│   └── en/                  # Textos em Inglês (mesma estrutura de chaves)
├── components/
│   └── portfolio/           # Componentes visuais modulares
│       ├── LanguageSwitcher.tsx # Botão PT | EN reutilizável
│       ├── FloatingNav.tsx      # Barra de navegação superior
│       ├── Hero.tsx             # Secção inicial
│       ├── Chapter.tsx          # Secções de capítulo na página principal
│       ├── ThreeHero.tsx        # Palco 3D (Cubo Rubik + Pássaros + Cartão ejetável)
│       ├── serra-da-leba-3d.ts  # Motor geométrico 3D low-poly da Serra da Leba
│       ├── About.tsx            # Página detalhada "Sobre Mim"
│       ├── AboutGlobe.tsx       # Globo 3D interativo onde o personagem caminha
│       ├── OriginStory.tsx      # Página detalhada "Jornada" (Timeline)
│       ├── Projects.tsx         # Catálogo de projetos com pesquisa e filtros
│       ├── ProjectShowcase.tsx  # Apresentação ecrã inteiro (Showcase) de cada projeto
│       ├── Skills.tsx           # Radar técnico dividido por 3 zonas de profundidade
│       ├── Contact.tsx          # Secção de contacto
│       ├── Footer.tsx           # Rodapé
│       ├── Preloader.tsx        # Ecrã de carregamento inicial
│       ├── ScrambleText.tsx     # Efeito de texto glitch/scramble
│       └── BrandIcons.tsx       # Ícones SVG (GitHub, LinkedIn, Twitter)
├── context/
│   └── language-context.tsx # Contexto React que sincroniza o idioma com o URL (/pt e /en)
├── lib/
│   ├── i18n.ts              # Carregador automático dos ficheiros YAML de src/locales/
│   ├── projects.ts          # Carregador automático dos ficheiros YAML de src/content/projects/
│   ├── scramble-utils.ts    # Funções puras partilhadas de animação de texto
│   └── utils.ts             # Utilitário de classes Tailwind (cn)
└── routes/                  # Rotas do site (TanStack Router)
    ├── __root.tsx           # Layout raiz e páginas de erro/404
    ├── index.tsx            # Página inicial (Scroll snap + Capítulos)
    ├── chapter.$chapterId.tsx   # Rota /pt/chapter/about, /work, /origin, /skills
    └── projects.$projectId.tsx  # Rota /pt/projects/<id_do_projeto>
```

---

## 2. Tarefas Comuns no Futuro (Receitas Rápidas)

### A. Como adicionar um novo Projeto
1. Coloca a imagem do projeto na pasta `public/img/works/` (ex: `meu_app.png`).
2. Vai a `src/content/projects/`, faz uma cópia de `_TEMPLATE.yaml` e dá-lhe um nome como `08-meu-app.yaml` (sem `_` no início).
3. Abre o novo ficheiro `.yaml` e preenche o `id`, `order`, `category` (`Web` ou `Mobile`), `tier` (`field` ou `lab`), `tags`, `image` e os blocos `pt:` e `en:`.
4. Guarda o ficheiro. **Não precisas de importar nada em nenhum `.tsx`** — o ficheiro `src/lib/projects.ts` deteta-o automaticamente!

### B. Como alterar Email, Telefone, Localização, Redes Sociais ou CV
1. Abre **`src/config/profile.ts`**.
2. Altera o valor no objeto `PROFILE` ou `SOCIAL_LINKS`.
3. Para substituir o teu currículo em PDF, basta substituir os ficheiros em `public/cv/vivaldo_roque_cv_pt.pdf` e `public/cv/vivaldo_roque_cv_en.pdf`.

### C. Como adicionar ou editar uma Tecnologia (Skill)
1. Abre **`src/config/skills-data.ts`** e adiciona o item na lista `SKILLS` (escolhe o `tier`: `"field"`, `"foundation"` ou `"explored"`).
2. Abre **`src/locales/pt/skills.yaml`** e **`src/locales/en/skills.yaml`** e adiciona as 3 chaves da tecnologia:
   ```yaml
   skill_minha_tech_headline: "Resumo curto..."
   skill_minha_tech_story: "Onde e como usei..."
   skill_minha_tech_evidence: "Prova concreta (ex: 2 projetos em produção)"
   ```

### D. Como adicionar um novo Curso, Experiência ou Certificação
1. Abre **`src/config/origin-data.ts`** e adiciona uma entrada em `ACADEMIC_TIMELINE`, `EXPERIENCE_TIMELINE` ou `CERTIFICATIONS_TIMELINE`.
2. Adiciona os respetivos textos em **`src/locales/pt/origin.yaml`** e **`src/locales/en/origin.yaml`**.

---

## 3. Comandos do Projeto

- **Iniciar servidor de desenvolvimento:**
  ```bash
  npm run dev
  ```
- **Compilar para produção (testar se há erros):**
  ```bash
  npm run build
  ```
- **Formatar código automaticamente:**
  ```bash
  npm run format
  ```
