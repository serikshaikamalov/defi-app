# DeFi App

A simple web application that displays user balances for 10 popular tokens on the Ethereum blockchain, including DAI, USDC, USDT, and the native token (ETH). The interface also displays the user allowance of each token for the 1inch router contract.

## Features

- Connect a wallet or enter an Ethereum address to retrieve balances.
- Display balances of 10 popular tokens on the Ethereum blockchain.
- Display the user allowance of each token for the 1inch router contract.
- Use Multicall to optimize fetching of token balances and allowances.

## Tokens Included

1. ETH (as WETH for ERC-20 compatibility)
2. DAI (Dai Stablecoin)
3. USDC (USD Coin)
4. USDT (Tether)
5. WETH (Wrapped Ether)
6. LINK (Chainlink)
7. UNI (Uniswap)
8. MKR (Maker)
9. AAVE (Aave)
10. COMP (Compound)
11. SUSHI (Sushi)

## Tech Stack

- Frontend: React
- Web3 Integration: ethers.js
- CSS Framework: Tailwind CSS
- Multicall: Multicall smart contract

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/defi-dashboard.git
   ```

2. Navigate to the project directory:

```
cd oneinchwallet
```

3. Install the dependencies:

```
    npm install
```

## Configuration

No additional configuration is required. The Ethereum provider is automatically configured to use the injected provider (e.g., MetaMask) from the user's browser.

## Running the Application

1. Start the development server:

```
npm start
```

2. Open your browser and navigate to http://localhost:3000.

## Additional Notes

Ensure your wallet (e.g., MetaMask) is connected to the Ethereum mainnet.
This application uses ethers.js to interact with the Ethereum blockchain.

# Todo

1. Ensure metamask is connected
2. Loading
3. Display error message properly
