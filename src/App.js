import React from 'react';
import Web3 from 'web3';
import './App.css';
import trc20abi from './constant/TRC20.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: "",
      symbol: "",
      address: "",
      interval: 0,
      tokenContract: ""
    }
    // This binding is necessary to make `this` work in the callback
    this.getBalance = this.getBalance.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.contractChange = this.contractChange.bind(this);

  }

  async getBalance() {
     const rpc = 'https://rpc.tomochain.com';
     const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
    //const rpc = 'https://rpc.testnet.tomochain.com';
    //const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

    var self = this;
    if (self.state.interval) {
      clearInterval(self.state.interval);
    }

    if (this.state.address && this.state.tokenContract) {
      let contract = new web3.eth.Contract(trc20abi, this.state.tokenContract);
      var decimal = await contract.methods.decimals().call();
      var symbol = await contract.methods.symbol().call();
      self.state.interval = setInterval(() => {
        contract.methods.balanceOf(this.state.address).call().then(r => {
          console.log(r);
          self.setState({
            balance: (r * 1) / Math.pow(10, decimal),
            symbol: symbol
          });
        })
      }, 1000);
    } else if (this.state.address) {
      self.state.interval = setInterval(() => {
        web3.eth.getBalance(this.state.address).then(r => {
          this.setState({
            balance: (r * 1) / Math.pow(10, 18),
            symbol: "TOMO"
          });
        }).catch((error) => {
          alert("Address not found");
        });
      }, 1000);
    }

  }
  addressChange(e) {
    this.setState({ address: e.target.value });
  }

  contractChange(e) {
    this.setState({ tokenContract: e.target.value });
  }
  
  render() {
    return (
      <div className="App">
        <div className="search-condition">
          <div className="row">
            <label className="column">Address: </label>
            <input type="text" name="input-address" onChange={this.addressChange} />
          </div>
          <div className="row">
            <label className="column">Token Contract: </label>
            <input type="text" name="input-contract" onChange={this.contractChange} />
          </div>
          <button onClick={this.getBalance}>Get Balance</button>
        </div>
        <div className="result">
          <label>Balance: </label>
          {this.state.balance} {this.state.symbol}
        </div>
      </div>
    );
  }

}



export default App;
