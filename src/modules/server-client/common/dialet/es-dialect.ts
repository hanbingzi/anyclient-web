export class EsDialect {
  tableTemplate(): string {
    return `// Create index
PUT /[indexName]
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
    }
}`;
  }
}
