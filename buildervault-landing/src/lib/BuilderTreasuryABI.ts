export const BuilderTreasuryABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_projectName", "type": "string" }],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_builder", "type": "address" }],
    "name": "getBuilderInfo",
    "outputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "string", "name": "project", "type": "string" },
      { "internalType": "uint256", "name": "since", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStats",
    "outputs": [
      { "internalType": "uint256", "name": "builders", "type": "uint256" },
      { "internalType": "uint256", "name": "totalFunds", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "builder", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "project", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "builder", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Withdrawn",
    "type": "event"
  }
] as const;

export const CONTRACT_ADDRESS = "0x876d81a05900aa02Da17320cB521ce1FF19F720A";