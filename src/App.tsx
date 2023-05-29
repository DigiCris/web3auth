import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./web3RPC";
import "./App.css";
import env from "react-dotenv";
import { ObjectType } from "typescript";
import { getBalance, getAccounts, provider, getChainId, getPrivateKey, sendTransaction, uiConsole, sendTransaction2} from "./funtions";
import { web3 } from "./conect";
import { USDC_MUMBAI } from "./contracts";
import { send } from "process";
import { useRef } from "react";
import ReactDOM from 'react-dom/client';

const clientId = "BJabe5X1eOo0s_1XLOVVMl-FqiZKCufHd-ushy-vTP5RV8Gqk--B5Fm5pRIiHGWZOZXDZgV7HFwcZU8uTdlbJP8"; // get from https://dashboard.web3auth.io

var provider2;

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [send, setSend] = useState<boolean | null>(null);
  provider2=null;

  useEffect(() => {
    //console.log('web3 => '+web3);
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId, 
          web3AuthNetwork: "testnet", // mainnet, aqua, celeste, cyan or testnet
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881", //0x1
            rpcTarget: env.URL_NODE, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
          provider2=web3auth.provider;
        };

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    provider2=web3authProvider;
  };

  
  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    provider2=null;
  };


  function prepareTransaction() {
    setSend(true);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={()=>{setSend(false); getAccounts();}} className="btn btn-info">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={async ()=>{setSend(false); getBalance(await getAccounts() , USDC_MUMBAI)}} className="btn btn-info">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={prepareTransaction} className="btn btn-info">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={()=>{setSend(false); logout();}} className="btn btn-danger">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="btn btn-success">
      Login
    </button>
  );


  const [name, setName] = useState("");
  const [price,setPrice] = useState("");
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      alert(`The name you entered was: ${name}`);
      alert(`The name you entered was: ${price}`);
      sendTransaction2(name,price);
    }
  
  const transactionSender = (
    <div>
    <form onSubmit={handleSubmit}>

    <div className="form-group">
          <select className="form-control" id="exampleFormControlSelect1"             value={name}
            onChange={(e) => setName(e.target.value)}>
            <option></option>
            <option>SWF Housing</option>
            <option>Baltimore Project</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Cantidad a invertir"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      <input className="btn btn-outline-dark" type="submit" value="Enviar" />
    </form>
    </div>
  );
  

  return (
    <div className="container">
      <nav className="navbar navbar-default">
        <h1 className="title">
          <a target="_blank" href="https://www.comunyt.com/" rel="noreferrer">
            Comuny-T &nbsp;
          </a>
          Wallet
        </h1>
      </nav>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <div className="grid">{send ? transactionSender : <></>}</div>


      <footer className="footer">
        <a href="https://www.comunyt.com/" target="_blank" rel="noopener noreferrer">
          Comuny-t all rights reserved
        </a>
      </footer>
    </div>
  );
}

export default App;