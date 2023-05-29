import env from "react-dotenv";
import { web3 } from "./conect";
import { ABI } from "./contracts";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./web3RPC";
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { ObjectType } from "typescript";
import { USDC_MUMBAI } from "./contracts";

const clientId = "BJabe5X1eOo0s_1XLOVVMl-FqiZKCufHd-ushy-vTP5RV8Gqk--B5Fm5pRIiHGWZOZXDZgV7HFwcZU8uTdlbJP8"; // get from https://dashboard.web3auth.io

export var provider:SafeEventEmitterProvider | null;

const InitM  = async () =>  {

  if (!provider) {
        const web3auth = await new Web3Auth({
          clientId, 
          web3AuthNetwork: "testnet", // mainnet, aqua, celeste, cyan or testnet
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881", //0x1
            rpcTarget: env.URL_NODE, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        await web3auth.initModal();

        if (web3auth.provider) {
          //setProvider2(web3auth.provider);
          provider= web3auth.provider;
        };
  }


}

export function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
}
















/*
balance(cuenta_de_quien_quiero_ver , Cuenta_del_ERC20_asociado);
Si no especifico la cuenta del erc20 asociado vemos la cantidad de matics que tiene la cuenta.
*/
export const getBalance = async (EOA:string, SC:string|null=null) => {
  await InitM();
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
    uiConsole(balance);
    return(balance);
  };

export  const getAccounts = async () => {
    await InitM();
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
    return address;
  };

export const getChainId = async () => {
  await InitM();
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

export const getPrivateKey = async () => {
  await InitM();
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };


export  const sendTransaction = async () => {
  await InitM();
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey= await rpc.getPrivateKey();

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: '0xd4A1d96902eFdD88b7185A05eaFa580eb8C2b45c',
         to: '0x68C966c88bA368f0b12549378dC1B31f92e4106a',
         value: 0,
         gas: '310000',
         data: '0xa9059cbb0000000000000000000000002684e385622856451e97d7298fa7fe3cccf062d10000000000000000000000000000000000000000000000008ac7230489e80000'
      },
      privateKey
   );
   const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );

    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };



  export  const sendTransaction2 = async (name:string,price:string) => {
    await InitM();
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    let _to;
    let _data='0xa9059cbb000000000000000000000000';
    if(name=="SWF Housing") {
      _to='80421c4B6ceD79C812f7C157Fd9523ceBaE3B649';
    }
    else {
      _to='dAaCb98FeA715f4177f1f592b73275e643C9a3CA';
    }
    _data=_data+_to;

// Definimos la constante a utilizar
const numero = parseFloat(price); //10;

// Realizamos la operación
let resultado = numero * Math.pow(10, 18);

// Convertimos a tipo Hexadecimal
let hexadecimal = Number(resultado).toString(16);

// Completamos con ceros
let completarCeros = hexadecimal.padStart(64, '0');

_data=_data+completarCeros;
console.log(_data);

let myAccount= await getAccounts();

    const rpc = new RPC(provider);
    const privateKey= await rpc.getPrivateKey();

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: myAccount,
         to: USDC_MUMBAI,
         value: 0,
         gas: '410000',
         data: _data
      },
      privateKey
   );
   const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );

    const receipt = await rpc.sendTransaction();
    uiConsole(createReceipt.transactionHash);
  };