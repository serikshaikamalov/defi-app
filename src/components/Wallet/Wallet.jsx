import React, { useState } from 'react'
import { fetchBalancesAndAllowances } from '../../utils/web3';
import { ethers } from 'ethers';

export default function Wallet() {
    const [userAddress, setUserAddress] = useState('0x82D05BFC325b17BF406b50E45D923Edfd8637609');
    const [balances, setBalances] = useState([]);

    const handleAddressChange = (e) => {
        const address = e.target.value       
        if(!ethers.utils.isHexString(address)){
            alert('Wrong address. Please provide valid ethereum address')
            return
        } 
        setUserAddress(address)
    }
    const getBalances = async () => {
        const results = await fetchBalancesAndAllowances(userAddress);
        setBalances(results);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">DeFi App</h1>
            <div className="mb-4">
                <input type="text"
                    placeholder='Enter ethereum address' 
                    required value={userAddress}
                    className='p-2'                    
                    style={{width: 500}}
                    onChange={handleAddressChange} />
                <button onClick={getBalances} className="ml-2 p-2 bg-blue-500 text-white rounded">
                    Fetch Balances
                </button>
            </div>        
            <div className="flex flex-col gap-4">
                {balances.map((token) => (
                <div key={token.address} className="border p-4 rounded">
                    <h2 className="text-xl font-bold">{token.symbol}</h2>                    
                    <p>Balance: {ethers.utils.formatUnits(token.balance, token.decimals)}</p>
                    <p>Allowance: {ethers.utils.formatUnits(token.allowance, token.decimals)}</p>
                </div>
                ))}
            </div>    
        </div>
    )
}
