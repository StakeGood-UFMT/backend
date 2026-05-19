const API_KEY = 'api_sand:d979fc9c-90b6-4db2-9a96-2c2add1defa4:558659a9-b049-4617-a2d4-b5010d8a6e4d';
const BASE_URL = 'https://api.sand.etherfuse.com';
const customerId = 'bd02b109-039f-4c5e-b5a1-263a172840b8';
const publicKey = 'GD2CQD64NYGVWP2TD6UZAKBDVFANF657Y7VQ3EK47LDB2VZB2KYCSMA6';
const bankAccountId = crypto.randomUUID();

async function main() {
  try {
    console.log('1. Registering bank account programmatically...');
    const registerRes = await fetch(`${BASE_URL}/ramp/customer/${customerId}/bank-account`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skipAutoApproval: false,
        bankAccountId,
        account: {
          transactionId: bankAccountId,
          firstName: 'Sandbox',
          paternalLastName: 'Auto',
          maternalLastName: 'Approved',
          birthDate: '19900101',
          birthCountryIsoCode: 'MX',
          curp: 'GALJ900101HDFRRN09',
          rfc: 'GALJ9001016V3',
          clabe: '012345678901234568' // control digit 8
        }
      })
    });

    if (!registerRes.ok) {
      console.error('Failed to register bank account:', await registerRes.text());
      return;
    }
    const registerData = await registerRes.json();
    console.log('Register response:', registerData);

    console.log('2. Getting onboarding URL...');
    const urlRes = await fetch(`${BASE_URL}/ramp/onboarding-url`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId,
        bankAccountId,
        publicKey,
        blockchain: 'stellar'
      })
    });

    if (!urlRes.ok) {
      console.error('Failed to get onboarding URL:', await urlRes.text());
      return;
    }
    const urlData = await urlRes.json();
    const presignedUrl = urlData.presigned_url;
    console.log('Presigned URL:', presignedUrl);

    console.log('3. Submitting agreements...');
    const agreements = ['electronic-signature', 'terms-and-conditions', 'customer-agreement'];
    for (const ag of agreements) {
      try {
        const agRes = await fetch(`${BASE_URL}/ramp/agreements/${ag}`, {
          method: 'POST',
          headers: {
            'Authorization': API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ presignedUrl })
        });
        if (!agRes.ok) {
          console.error(`Failed to accept ${ag}:`, await agRes.text());
        } else {
          console.log(`Accepted ${ag}:`, await agRes.json());
        }
      } catch (err) {
        console.error(`Failed to accept ${ag}:`, err.message);
      }
    }

    console.log('4. Checking bank account status...');
    const accountsRes = await fetch(`${BASE_URL}/ramp/customer/${customerId}/bank-accounts`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    if (!accountsRes.ok) {
      console.error('Failed to check bank account status:', await accountsRes.text());
    } else {
      const items = (await accountsRes.json()).items;
      console.log('Bank accounts:', JSON.stringify(items.filter(i => i.bankAccountId === bankAccountId), null, 2));
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
