import React, { useState } from 'react'
import { fetchBalancesAndAllowances } from '../../utils/web3';
import { ethers } from 'ethers';

export default function Wallet() {
    const [userAddress, setUserAddress] = useState('0x82D05BFC325b17BF406b50E45D923Edfd8637609');
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleAddressChange = (e) => {          
        setUserAddress(e.target.value)
    }
    const getBalances = async () => {
        try {
            if(!ethers.utils.isHexString(userAddress)){
                alert('Wrong address. Please provide valid ethereum address')
                return
            } 

            setLoading(true)
            const results = await fetchBalancesAndAllowances(userAddress);
            setBalances(results);
        } catch (ex) {
            console.error(`getBalances ex: `, ex)
            setError(ex?.message)
        }finally{
            setLoading(false)            
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">DeFi App</h1>
            <div className="mb-4">
                <input type="text"
                    placeholder='Enter ethereum address' 
                    required value={userAddress}
                    className='p-2 w-[100%] md:w-1/3 bg-gray-50 border border-gray-300'                                        
                    onChange={handleAddressChange} />
                <button onClick={getBalances} className="ml-2 p-2 bg-blue-500 text-white rounded">
                    Fetch Balances
                </button>
            </div>        
            <div className="flex flex-col gap-4">
                {loading && <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>}
                {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                   {error}
                </div>}
                {!loading && !error && balances.map((token) => (
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
