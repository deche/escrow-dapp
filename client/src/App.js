import React, { useState } from 'react';
import Escrow from './artifacts/src/contracts/Escrow.sol/Escrow';
import {ethers} from 'ethers';
import 'bulma/css/bulma.min.css';
import './App.css';


const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

 provider.send("eth_requestAccounts", []);


 const App = () =>  {
  const [contracts, setContracts] = useState({});
  const [arbiter, setArbiter] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  async function deploy(arbiter, beneficiary, value) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
    return factory.deploy(arbiter, beneficiary, { value });
  }
  
  async function newContract() {
    if (typeof window.ethereum !== 'undefined') {
      let value = ethers.BigNumber.from(amount);
      const contract = await deploy(arbiter, beneficiary, value);
      console.log(contract);
      contract.x_arbiter = arbiter;
      contract.x_beneficiary = beneficiary;
      //setContracts(contracts => [...contracts, contract]);
      const newContracts = {...contracts};
      newContracts[contract.address] = contract;
      setContracts(newContracts);
    } else {
      console.log('ethereum undefined');
    }
  
  }

  async function approve(contract) {
    const signer = provider.getSigner();
    await contract.connect(signer).approve();
    const newContracts = {...contracts};
    delete newContracts[contract.address];
    setContracts(newContracts);
  } 

  return (
    <div className="container create-contract">
      <section className="section">
      <div className="title">Escrow App</div> 
        <div class="field">
          <label class="label">Arbiter address</label>
          <div class="control">
            <input class="input" type="text" value={arbiter} onChange={e => setArbiter(e.target.value)} />
          </div>
        </div>
        <div class="field">
          <label class="label">Beneficiary address</label>
          <div class="control">
            <input class="input" type="text" value={beneficiary} onChange={e => setBeneficiary(e.target.value)} />
          </div>
        </div>
        <div class="field">
          <label class="label">Amount</label>
          <div class="control">
            <input class="input amount" type="text" value={amount} onChange={e => setAmount(e.target.value)}  />
            <div class="select">
      <select>
        <option>ether</option>
        <option>wei</option>
      </select>
    </div>  
          </div>
        
        </div>

        <button class="button is-link" onClick={newContract}>Create Contract</button>
      </section>

      <section className="section">
      <div className="subtitle">Contracts list</div>
        <div>
          {Object.keys(contracts).map((key) => 
            <div key={key}>
              Address: {contracts[key].address}<br />
              arbiter: {contracts[key].x_arbiter}<br />
              beneficiary: {contracts[key].x_beneficiary}

              <button onClick={() => approve(contracts[key])}>Approve</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
