# Project Roadmap & Findings

## Bugs & Critical Issues

- [ ] **Identifier Escaping**: Currently, table and schema names with spaces, special characters, or reserved words (like `user`, `order`, `group`) will cause queries to fail because they aren't wrapped in double quotes in `db-service.ts`.
- [ ] **Incomplete Multi-statement Results**: `executeQuery` in `db.ts` only returns the metadata and data for the _last_ statement in a multi-statement query. Users should ideally see results for all executed statements.
- [x] **Record Table Order**: `records-table.svelte` iterates over `Object.entries(record)`, which doesn't guarantee the columns will appear in the order defined by the database. It should iterate over `result.meta.columns` instead.
- [x] **Redundant Connection Closing**: Manual `client.end()` in `db.ts` might be fighting against the `postgres` library's built-in connection pooling. Consider letting the library manage the pool lifecycle.

## Postgres-specific Features

- [ ] **Views & Materialized Views**: Update `getTables` to include views, and add a separate query/UI for Materialized Views (`pg_matviews`).
- [ ] **Postgres Extensions**: Add a view to see installed extensions (`pg_extension`) and available ones (`pg_available_extensions`).
- [ ] **Table Maintenance**: Add UI actions for `VACUUM`, `ANALYZE`, and `REINDEX` on specific tables.
- [ ] **Advanced Type Support**: Better UI for Postgres-specific types like `JSONB` (searchable/expandable), `INET`, `UUID`, and `INTERVAL`.
- [ ] **Database Dashboard**: Show active backends, locks, and long-running queries using `pg_stat_activity`.
- [ ] **Schema Size**: Show disk space usage for tables and indexes (`pg_total_relation_size`).
- [ ] **Custom Types & Enums**: Support for listing and managing user-defined types (UDTs) and enumerations.
- [ ] **Explain Analyze**: A button to run `EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON)` and visualize the execution plan.

## UX & Performance Improvements

- [ ] **Virtual Scrolling**: The `records-table.svelte` uses a simple `{#each}` loop. For tables with 1,000+ rows, the DOM will become slow. Implement a virtualized list.
- [ ] **In-cell Editing**: Double-click a cell to edit its value directly and save back to the DB.
- [ ] **Copy as SQL**: Ability to select rows and "Copy as INSERT" or "Copy as UPDATE" statements.
- [ ] **Query History Persistence**: Save query history to a local file or a special metadata table in the database so it survives page reloads.
- [ ] **Better Error Messages**: Parse Postgres error codes (SQLSTATE) to provide more user-friendly explanations (e.g., "Foreign key violation" instead of raw error strings).

## Old todos

- [ ] **Sorting**: Click column headers to sort records (`ORDER BY`).
- [ ] **Quick Filter**: A search bar to filter records by any column value.
- [ ] **Foreign Key Navigation**: Detect FKs and make them clickable to jump to the related record.
- [ ] **Export Data**: Download results as CSV, JSON, or SQL dump.
- [ ] **Execution Plan**: "Explain" button to show the database execution plan.
- [ ] **Schema Designer**: UI to create tables, add columns, and define constraints.
- [ ] **Database/User Management**: Tools to manage DB users and permissions.
- [ ] **ER Diagram**: Visual representation of the database schema relationships.
- [ ] **Fix showing proper enums**
- [x] **Pagination**: Add `LIMIT` and `OFFSET` to the records view to handle large tables.
- [x] **JSON Viewer**: Pretty-print JSON columns in the table cells.
- [x] **Intellisense**: Enhance CodeMirror with autocomplete for tables and columns from the current schema.
- [x] **Query Formatting**: "Beautify SQL" button in the editor.
- [x] **Better Connection Management**: The current idle timeout mechanism in `db.ts` works but could be more robust (e.g., pooling).
- [x] **Global Error Handler**: Standardize how DB errors are returned to the frontend for better UI notifications.
- [x] **Sticky Headers**: Ensure table headers stay at the top when scrolling through long datasets.
- [x] **NULL Visibility**: Explicitly style `NULL` values so they are distinguishable from empty strings.
- [x] **URL Encoding**: Double check that complex connection strings (with special chars in passwords) are handled correctly in `db-url.ts`.
- [x] **Type Handling**: Ensure `bytea`, `uuid`, and other Postgres-specific types are displayed correctly in the UI.
