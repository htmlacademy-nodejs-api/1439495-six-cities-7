type MongoConfig = {
  username: string,
  password: string,
  host: string,
  port: number,
  databaseName: string
}

export function getMongoURI({username, password, host, port, databaseName}: MongoConfig): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
}
