export async function getDb() {
  return {
    run: async (sql: string, params?: any[]) => {},
    all: async (sql: string, params?: any[]) => []
  };
}
