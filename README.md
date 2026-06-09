# pgbrowser

pgbrowser is a web based PostgreSQL browser built with Svelte 5 and Bun. It provides a lightweight interface for database exploration and query execution, compiling to a single binary with no external dependencies.

## Features

* Database Navigation: Browse databases, schemas, and tables.
* Schema Exploration: View table structures, columns, indexes, foreign keys, and check constraints.
* Logic Inspection: List and view details for functions and triggers.
* Query Editor: Execute SQL with a CodeMirror 6 editor featuring SQL syntax highlighting and JSON formatting.
* Data Viewer: Browse table records with support for JSON pretty-printing and null value visualization.
* Metrics: View schema and table size metrics.

## Roadmap

See [todos.md](./todos.md) for the full list of planned features, performance improvements, and known issues.

## Screenshots

## Tech Stack

* Framework: Svelte 5 and SvelteKit
* Runtime: Bun
* Styling: Tailwind v4
* Database Client: Postgres.js

## Prerequisites

* Bun (>v1.1)
* Docker (optional)

## Installation and Build

### From Source

```bash
git clone https://github.com/Arnovda1/pgbrowser.git
cd pgbrowser
bun install
bun run build
```

The build process generates a binary at `dist/pgbrowser`.

### Using Docker

```bash
docker build -t pgbrowser .
docker run -p 3000:3000 pgbrowser
```

> Use `host.docker.internal` instead of `localhost` when connecting to a postgres server running on the host machine.

## Development

Start the development server with hot module replacement:

```bash
bun dev
```

The application will be available at `http://localhost:5173`.

## License

This project is licensed under the MIT License.
