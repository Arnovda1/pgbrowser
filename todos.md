# Project Roadmap & Findings

This document tracks the current status, planned features, and known issues for **pgbrowser**.

---

## Features

- [ ] **In-cell Editing**: Double-click a cell to edit its value directly and save back to the DB.
- [ ] **Copy as SQL**: Ability to select rows and "Copy as INSERT" or "Copy as UPDATE" statements.
- [ ] **Query History Persistence**: Save query history to a local file or a special metadata table so it survives page reloads.
- [ ] **Sorting**: Click column headers to sort records (`ORDER BY`).
- [ ] **Quick Filter**: A search bar to filter records by any column value.
- [ ] **Export Data**: Download results as CSV, JSON, or SQL dump.
- [ ] **Views & Materialized Views**: Support for viewing and querying `pg_matviews`.
- [ ] **Postgres Extensions**: View installed (`pg_extension`) and available extensions.
- [ ] **Table Maintenance**: UI actions for `VACUUM`, `ANALYZE`, and `REINDEX`.
- [ ] **Advanced Type Support**: Specialized UI for `JSONB`, `INET`, `UUID`, and `INTERVAL`.
- [ ] **Database Dashboard**: Show active backends and locks via `pg_stat_activity`.
- [ ] **Schema Size**: Show disk space usage (`pg_total_relation_size`).
- [ ] **Custom Types & Enums**: Support for listing and managing UDTs and Enums.
- [ ] **Explain Analyze**: Visualizer for `EXPLAIN (ANALYZE, ...)` results.
- [ ] **ER Diagram**: Visual representation of database schema relationships.
- [ ] **Path Aware**: Make path aware so it doesn't need a subdomain, eg: example.com/admin/pgbrowser

## Issues

- [ ] **Identifier Escaping**: Ensure table and schema names with special characters are wrapped in double quotes.
- [ ] **Multi-statement Results**: Support showing results for all statements in a single query execution.
- [ ] **Better Error Messages**: Parse Postgres error codes (SQLSTATE) to provide more user-friendly explanations.
- [ ] **Enums**: Currently enums show as unknown(69920)
- [ ] **Virtual Scrolling**: Implement a virtualized list for the `records-table.svelte` to handle 1,000+ rows efficiently.
- [ ] **Fix view selection**: Selecting a record in a view means all rows get highlighted + json viewer is empty
- [ ] **Show load more in views**: With views with 50+ records, show the view more button like in the tables
- [ ] **Show the record**: instead of the id at .../table/[table]/record/[id]

## Completed

- [x] **Pagination**: Added `LIMIT` and `OFFSET` handling.
- [x] **JSON Viewer**: Pretty-printing for JSON columns.
- [x] **Intellisense**: CodeMirror autocomplete for tables and columns.
- [x] **Query Formatting**: "Beautify SQL" feature.
- [x] **NULL Visibility**: Explicit styling for `NULL` values.
- [x] **Sticky Headers**: Fixed headers for long data tables.
- [x] **URL Encoding**: Robust connection string handling.
- [x] **Type Handling**: Proper display for `bytea`, `uuid`, etc.
- [x] **ER Diagram (Initial)**: Basic implementation of schema visualization.
- [x] **Record Table Order**: Fixed column ordering based on DB metadata.
- [x] **Connection Management**: Improved pooling and lifecycle management.
