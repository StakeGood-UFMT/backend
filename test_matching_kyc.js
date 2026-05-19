const API_KEY = 'api_sand:d979fc9c-90b6-4db2-9a96-2c2add1defa4:558659a9-b049-4617-a2d4-b5010d8a6e4d';
const BASE_URL = 'https://api.sand.etherfuse.com';
const customerId = crypto.randomUUID();
const bankAccountId = crypto.randomUUID();
const publicKey = 'GD2CQD64NYGVWP2TD6UZAKBDVFANF657Y7VQ3EK47LDB2VZB2KYCSMA6';

async function main() {
  try {
    console.log('1. Creating Child Organization...');
    const orgRes = await fetch(`${BASE_URL}/ramp/organization`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: customerId,
        displayName: 'Sandbox User',
        accountType: 'personal',
        userInfo: {
          email: `${customerId}@stakegood.com`,
          displayName: 'Sandbox User'
        },
        wallets: [
          { publicKey, blockchain: 'stellar' }
        ]
      })
    });
    console.log('Org response:', await orgRes.json());

    console.log('2. Submitting KYC Identity Data...');
    const kycRes = await fetch(`${BASE_URL}/ramp/customer/${customerId}/kyc`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pubkey: publicKey,
        identity: {
          id: publicKey,
          email: 'sandbox@stakegood.com',
          phoneNumber: '+5211999999999',
          occupation: 'Software Engineer',
          name: {
            givenName: 'Sandbox',
            familyName: 'AutoApproved'
          },
          dateOfBirth: '1990-01-01',
          address: {
            street: '123 Sandbox Blvd',
            city: 'Mexico City',
            region: 'CDMX',
            postalCode: '01000',
            country: 'MX'
          },
          idNumbers: [
            { value: 'GALJ900101HDFRRN09', type: 'CURP' },
            { value: 'GALJ9001016V3', type: 'RFC' }
          ]
        }
      })
    });
    console.log('KYC response:', await kycRes.json());

    console.log('3. Registering Bank Account programmatically...');
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
          paternalLastName: 'AutoApproved',
          maternalLastName: '',
          birthDate: '19900101',
          birthCountryIsoCode: 'MX',
          curp: 'GALJ900101HDFRRN09',
          rfc: 'GALJ9001016V3',
          clabe: '012345678901234568'
        }
      })
    });
    console.log('Register response:', await registerRes.json());

    console.log('4. Getting onboarding URL...');
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
    const urlData = await urlRes.json();
    const presignedUrl = urlData.presigned_url;
    console.log('Presigned URL:', presignedUrl);

    console.log('5. Submitting agreements...');
    const agreements = ['electronic-signature', 'terms-and-conditions', 'customer-agreement'];
    for (const ag of agreements) {
      const agRes = await fetch(`${BASE_URL}/ramp/agreements/${ag}`, {
        method: 'POST',
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ presignedUrl })
      });
      console.log(`Accepted ${ag}:`, await agRes.json());
    }

    console.log('6. Checking bank account status...');
    const accountsRes = await fetch(`${BASE_URL}/ramp/customer/${customerId}/bank-accounts`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const items = (await accountsRes.json()).items;
    console.log('Bank accounts:', JSON.stringify(items, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
