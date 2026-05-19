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
    UPDATE ngos 
    SET balances = '{}'::jsonb;
  `;
  
  try {
    const res = await client.query(query);
    console.log(`Reset ${res.rowCount} NGOs.`);
  } catch (err) {
    console.error('Error updating NGOs:', err);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
