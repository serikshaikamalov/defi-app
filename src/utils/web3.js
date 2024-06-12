import { ethers } from "ethers"
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { MULTICALL_ADDRESS, ONE_INCH_ROUTER_ADDRESS, TOKEN_ADDRESSES } from './constants';
import MulticallAbi from './MulticallAbi.json';

export const fetchBalancesAndAllowances = async (userAddress) => {
    checkMetamaskForInstallation()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const multicall = new Contract(MULTICALL_ADDRESS, MulticallAbi, provider);
    await checkNetwork(provider)

    const tokenAddresses = Object.values(TOKEN_ADDRESSES);
    const calls = tokenAddresses.flatMap((address) => [
        { target: address, callData: new Interface(['function balanceOf(address)']).encodeFunctionData('balanceOf', [userAddress]) },
        { target: address, callData: new Interface(['function allowance(address, address)']).encodeFunctionData('allowance', [userAddress, ONE_INCH_ROUTER_ADDRESS]) },
        { target: address, callData: new Interface(['function decimals()']).encodeFunctionData('decimals', []) },
        { target: address, callData: new Interface(['function symbol()']).encodeFunctionData('symbol', []) },
    ]);

    const { returnData } = await multicall.aggregate(calls);
    console.log("fetchBalancesAndAllowances: ", {
        returnData,
        calls
    });
    const results = [];
    for (let i = 0; i < tokenAddresses.length; i++) {
        const balance = ethers.BigNumber.from(returnData[i * 4]);
        const allowance = ethers.BigNumber.from(returnData[i * 4 + 1]);
        const decimals = ethers.BigNumber.from(returnData[i * 4 + 2]).toNumber();
        const symbolHex = returnData[i * 4 + 3];
        const symbol = ethers.utils.defaultAbiCoder.decode(['string'], symbolHex)[0];
        results.push({ address: tokenAddresses[i], balance, allowance, decimals, symbol });
    }

    // Getting balance of the native token(ETH)
    const ethBalance = await provider.getBalance(userAddress);
    results.unshift({
        address: 'ETH',
        balance: ethBalance,
        allowance: ethers.BigNumber.from(0), // ETH does not have an allowance concept
        decimals: 18,
        symbol: 'ETH'
    });
    return results;
};

export const checkMetamaskForInstallation = () => {
    if (!window.ethereum) {
        throw new Error('WEB Wallet is not installed! Please connect your web3 wallet(ie: Metamask)')
    }
    return true
}


export const checkNetwork = async (provider) => {
    const network = await provider.getNetwork();
    // 1 is the chain ID for the Ethereum mainnet
    if (network.chainId !== 1) {
        throw new Error('Please connect to the Ethereum mainnet.')
    }
    return true
};