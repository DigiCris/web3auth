import env from "react-dotenv";
import { web3 } from "./conect";
import { ABI } from "./contracts";

export const balance = async (EOA:string, SC:string|null=null) => {
    var balance;
    if(!SC) {
      balance = web3.utils.fromWei(
        await web3.eth.getBalance(EOA),
        'ether'
      );
      console.log(`The balance of ${EOA} is: ${balance} ETH.`);      
    }
    else {
        const usdc_contract= new web3.eth.Contract(ABI,SC);
        balance = web3.utils.fromWei(
            await usdc_contract.methods.balanceOf(EOA).call(),
            'ether'
          );
        console.log(`The balance of ${EOA} is: ${balance} USDC.`); 
    }
    return(balance);
  };
