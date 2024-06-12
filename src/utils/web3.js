import { ethers } from "ethers"
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { MULTICALL_ADDRESS, ONE_INCH_ROUTER_ADDRESS, TOKEN_ADDRESSES } from './constants';
import MulticallAbi from './MulticallAbi.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const multicall = new Contract(MULTICALL_ADDRESS, MulticallAbi, provider);

export const fetchBalancesAndAllowances = async (userAddress) => {
    try {
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

        const ethBalance = await provider.getBalance(userAddress);
        results.unshift({
            address: 'ETH',
            balance: ethBalance,
            allowance: ethers.BigNumber.from(0), // ETH does not have an allowance concept
            decimals: 18,
            symbol: 'ETH'
        });
        return results;
    } catch (ex) {
        console.error(ex)
    }
};

