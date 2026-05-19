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
    UPDATE ngos n
    SET total_funds_received = (
      SELECT COALESCE(SUM(amount), 0)
      FROM impact_ledger_entries i
      WHERE i.ngo_id = n.id::text OR i.ngo_id = n.on_chain_id::text
    );
  `;
  
  try {
    const res = await client.query(query);
    console.log(`Updated ${res.rowCount} NGOs.`);
  } catch (err) {
    console.error('Error updating NGOs:', err);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
