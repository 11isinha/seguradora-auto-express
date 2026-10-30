# Auto Express — Seguradora Digital

Aplicação desenvolvida como projeto acadêmico para a disciplina de Programação para Dispositivos Móveis II.

O Auto Express permite registrar ocorrências de sinistros automotivos, cadastrar informações do acidente e enviar fotografias diretamente pelo dispositivo. Os dados são armazenados no Supabase Database e as imagens no Supabase Storage.

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Supabase Database
- Supabase Storage
- Capacitor
- Capacitor Camera
- Lucide React

## Funcionalidades

- Formulário para cadastro de ocorrências.
- Registro do nome do segurado, placa e modelo do veículo.
- Registro da data, local e descrição do acidente.
- Captura de fotografias pela câmera ou seleção pela galeria.
- Envio de imagens para o Supabase Storage.
- Armazenamento dos dados da ocorrência no Supabase Database.
- Associação da fotografia à ocorrência por meio de sua URL pública.

## Como executar o projeto

### 1. Pré-requisitos

Antes de começar, é necessário ter instalado:

- Node.js
- npm
- Git

### 2. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd seguradora-auto-express
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

Preencha as informações do seu projeto Supabase:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

Não compartilhe suas credenciais privadas e não envie o arquivo `.env` para o GitHub.

### 5. Configurar o Supabase

No painel do Supabase:

1. Crie um projeto.
2. Configure a tabela `ocorrencias` no Database.
3. Crie um bucket chamado `fotos-camera` no Storage.
4. Configure as políticas de acesso necessárias para inserir os registros e enviar as fotografias.

A tabela `ocorrencias` armazena os dados do acidente e a URL da fotografia. O arquivo da imagem fica armazenado no bucket `fotos-camera`.

### 6. Executar o projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite apresentará o endereço local para acessar a aplicação no navegador.

## Executar no Android

Para sincronizar os arquivos com o projeto Android:

```bash
npx cap sync android
```

Para abrir o projeto no Android Studio:

```bash
npx cap open android
```

## Estrutura de armazenamento

**Supabase Database**

Armazena:
- Nome do segurado;
- Placa do veículo;
- Modelo do veículo;
- Data da ocorrência;
- Local do acidente;
- Descrição;
- URL da fotografia.

**Supabase Storage**

Armazena os arquivos de imagem enviados pelo usuário.

## Segurança

As variáveis de ambiente são utilizadas para configurar a conexão com o Supabase.

O arquivo `.env` não deve ser enviado ao repositório. O projeto disponibiliza um `.env.example` com os nomes das variáveis necessárias, sem valores confidenciais.

## Projeto acadêmico

Desenvolvido para fins educacionais, com foco na integração de aplicações móveis, captura de imagens e armazenamento em nuvem.
