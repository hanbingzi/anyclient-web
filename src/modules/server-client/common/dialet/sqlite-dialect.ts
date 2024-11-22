export {};
// import {DefaultDialect} from "./default-dialect";
//
// export class SqliteDialect extends DefaultDialect {
//
//   showIndex(database: string, table: string): string {
//     return `SELECT name index_name
//             FROM sqlite_master
//             WHERE type = 'index'
//               and tbl_name = '${table}' `;
//   }
//
//   dropIndex(table: string, indexName: string): string {
//     return `DROP INDEX ${indexName};`
//   }
//
//   showTables(database: string): string {
//     return `SELECT name, type
//             FROM sqlite_master
//             WHERE type = "table"
//               AND name <> 'sqlite_sequence'
//               AND name <> 'sqlite_stat1'
//             ORDER BY type ASC, name ASC;`;
//   }
//
//   showColumns(database: string, table: string): string {
//     return `PRAGMA table_info(${table})`;
//   }
//
//   showViews(database: string): string {
//     return `SELECT name, type
//             FROM sqlite_master
//             WHERE type = "view"
//               AND name <> 'sqlite_sequence'
//               AND name <> 'sqlite_stat1'
//             ORDER BY type ASC, name ASC;`;
//   }
//
//
//   buildPageSql(database: string, table: string, pageSize: number): string {
//     return `SELECT *
//             FROM ${table} LIMIT ${pageSize};`;
//   }
//
//
//   showTableSource(database: string, table: string): string {
//     return `SELECT sql "Create Table"
//             FROM sqlite_master
//             where name ='${table}' and type ='table';`
//   }
//
//   showViewSource(database: string, table: string): string {
//     return `SELECT sql "ViewDefinition"
//             FROM sqlite_master
//             where name ='${table}' and type ='view';`
//   }
//
//
//   tableTemplate(): string {
//     return `CREATE TABLE [name]
//     (
//         id
//         INTEGER
//         NOT
//         NULL
//         primary
//         key,
//             [
//         column]
//         TEXT
//             );`
//   }
//
//   viewTemplate(): string {
//     return `CREATE VIEW [name]
// AS
// SELECT * FROM ...;`
//   }
//
//
// }
