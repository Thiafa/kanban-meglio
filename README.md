# Kanban Meglio

Este repositório contém um projeto Kanban dividido em duas partes principais: **frontend** e **backend**. O **frontend** é foi desenvolvido com HTML, CSS e JavaScript (Jquery). O **backend** foi desenvolvido em php (Laravel).

## Requisitos

- PHP ^8.x
- Composer ^^2.x.x
- Git

## Instruções

### 1. Clonar o Repositório

Para clonar o repositório use o seguinte comando:

```bash
git clone https://github.com/Thiafa/kanban-meglio.git
```

Acesse a pasta e atualize o projeto:

```
cd kanban-meglio
git pull origin main
```

### 2. Configurar o Backend

Para configurar o backend acesse a pasta backend e utilize o comando do composer para instalar as dependências:

```
cd backend
composer install
```

Crie o arquivo .env:

```
cp .env.example .env
php artisan key:generate
```

Crie um banco de dados chamado kanbandb no seu sgdb de preferência adicione as configurações na .env:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

Para criar as tabelas utilize o comando:

```
php artisan migrate
```

Para rodar o projeto (localmente) digite o comando:

```
php artisan serve
```

### 3. Acessar o frontend

Para acessar o frontend da aplicação navegue até a pasta e abra o arquivo index.html no seu navegador.

```
cd frontend
```
