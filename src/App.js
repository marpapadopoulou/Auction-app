import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { highestBid: 0,highestBidder: null, userBalances: 0, web3: null, accounts: null, contract: null, input: "" };

  



componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
const highestBid_response= await instance.methods.highestBid().call();

const highestBidder_response= await instance.methods.highestBidder().call();

const userBalances_response= await instance.methods.userBalances(accounts[0]).call();


      this.setState({ web3, accounts, contract: instance, highestBid: highestBid_response, highestBidder: highestBidder_response, userBalances: userBalances_response });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  bid = async () => {
    const { accounts, contract, web3 } = this.state;

    // bids the value
    await contract.methods.bid().send({ from: accounts[0], value: this.state.input });

	
    const highestbid = await contract.methods.highestBid().call();
    
    const highestbidder = await contract.methods.highestBidder().call();

	this.setState({highestBid: highestbid, highestBidder: highestbidder, userBalances:this.state.input});
  };



 withdraw = async () => {
    const { accounts, contract } = this.state;

    await contract.methods.withdraw().send({ from: accounts[0]});
    
    const highestbid = await contract.methods.highestBid().call();
    
    const highestbidder = await contract.methods.highestBidder().call();
    
    this.setState({highestBid: highestbid,  highestBidder: highestbidder, userBalances: 0});
  };



 getHighestBid = async (input) => {
    const { accounts, contract } = this.state;

    const response = await contract.methods.getHighestBid.call();
    this.setState({highestBid: response});
      };





 getHighestBidder = async (input) => {
    const { accounts, contract } = this.state;

    const response = await contract.methods.getHighestBidder.call();
    this.setState({highestBidder: response});
      };


myChangeHandler = (event) => {
    this.setState({input: event.target.value});
}

  


render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction Smart Contract Dapp!</h1>
        <div>The highest bid is: {this.state.highestBid}</div>
	  <div>The highest bidder is: {this.state.highestBidder}</div>


	  <h3>Information about you:</h3>
        <div>Your bid: {this.state.userBalances}</div>
        
	 < input type="text" onChange={this.myChangeHandler}/>
	<button onClick={this.bid}> Bid here </button>
	 <br></br>
	<button onClick={this.withdraw}> Withdraw here </button>
	</div>
    );
  }
}

export default App;
