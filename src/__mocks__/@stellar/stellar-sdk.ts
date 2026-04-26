const mockTx = {
  toXDR: jest.fn().mockReturnValue('mock-xdr'),
  hash: jest.fn().mockReturnValue({ toString: () => 'mock-hash' }),
};

const mockBuilder = {
  addOperation: jest.fn().mockReturnThis(),
  setTimeout: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue(mockTx),
};

export const Operation = {
  invokeHostFunction: jest.fn().mockReturnValue({}),
};

export const xdr = {
  HostFunction: { hostFunctionTypeInvokeContract: jest.fn() },
  InvokeContractArgs: jest.fn(),
};

export const Address = jest.fn().mockImplementation(() => ({
  toScAddress: jest.fn(),
}));

Address.fromString = jest.fn().mockReturnValue({ toScAddress: jest.fn() });

export const nativeToScVal = jest.fn();

export const TransactionBuilder = jest.fn().mockImplementation(() => mockBuilder);

export const Account = jest.fn();

export const Networks = { TESTNET: 'Test SDF Network ; September 2015' };

export const TimeoutInfinite = 0;
