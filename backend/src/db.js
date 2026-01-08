// Minimal db stub
async function getDb() {
  return {
    run: async () => {},
    all: async () => []
  };
}

module.exports = { getDb };
