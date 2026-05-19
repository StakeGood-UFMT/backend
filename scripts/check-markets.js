const { Client } = require('pg');
const fs = require('fs');

function parseEnv() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1]] = match[2];
    }
  });
  return env;
}

async function main() {
  const env = parseEnv();
  
  const client = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const query = `
    SELECT id, on_chain_id, status FROM markets;
  `;
  
  try {
    const res = await client.query(query);
    console.log(res.rows);
  } catch (err) {
    console.error('Error fetching entries:', err);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
