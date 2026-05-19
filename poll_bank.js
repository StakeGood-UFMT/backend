const API_KEY = 'api_sand:d979fc9c-90b6-4db2-9a96-2c2add1defa4:558659a9-b049-4617-a2d4-b5010d8a6e4d';
const BASE_URL = 'https://api.sand.etherfuse.com';
const customerId = '0ce4a31e-9ff9-4cdf-aae5-e1534b4adb56';

async function main() {
  for (let i = 1; i <= 10; i++) {
    try {
      const res = await fetch(`${BASE_URL}/ramp/customer/${customerId}/bank-accounts`, {
        method: 'POST',
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      console.log(`Poll ${i}:`, JSON.stringify(data.items, null, 2));
    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(r, 3000));
  }
}

main();
