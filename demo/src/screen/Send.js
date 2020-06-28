import React from 'react';

import * as transactions from '@liskhq/lisk-transactions';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import { getAccountByAddress, postTransaction } from 'password-lock-transaction-core-utils';
import { toast } from 'react-toastify';
import * as io from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Send.css';

import { getTimestamp, networkIdentifier } from 'password-lock-transaction-core-utils';
import { PasswordLockSendTransaction } from 'password-lock-transaction';

class Send extends React.Component {

    moveTop = () => {
        this.props.history.push('/');
    }

    findAccount = async() => {
        this.setState({currentBalance: "0"});
        if (!this.state.address) return;
        try {
            const res = await getAccountByAddress(this.state.address);
            if (!res) return;
            this.setState({currentBalance: transactions.utils.convertBeddowsToLSK(res.balance)});
        } catch (err) {
            console.log(err);
        }
    }

    sendTransaction = async() => {
        try {
            const amount = this.state.amount;
            if (!amount || amount.length === 0 || amount < 0.1 || amount > 1000) {
                toast("amount must be in the range 0.1 to 1000.");
                return;
            }
            const message = this.state.message;
            if (message && message.length > 50) {
                toast("message must be within 50 characters.");
                return;
            }
            const passphrase = this.state.passphrase;
            if (!passphrase || passphrase.length === 0) {
                toast("passphrase required.");
                return;
            }
            const address = getAddressFromPassphrase(passphrase);
    
            const param = {
                asset: {
                  amount: transactions.utils.convertLSKToBeddows(this.state.amount),
                  data: {
                    senderId: address,
                    amount: +this.state.amount
                  }
                },
                fee: PasswordLockSendTransaction.FEE,
                networkIdentifier: networkIdentifier,
                timestamp: getTimestamp()
              }
              const tx = new PasswordLockSendTransaction(param);
              tx.sign(passphrase);
              const res = await postTransaction(tx);
              if (!res) {
                  toast("Sending failed.");
                  return;
              }
              
              console.log(tx.id);
              console.log(tx.password);
              console.log(res);

        } catch (err) {
            console.log(err);
        }
    }

    changeText = (e, name) => {
        const s = this.state;
        let v = e.target.value;
        if (name === "address") v = v.toUpperCase();
        if (name === "passphrase") v = v.toLowerCase();
        s[name] = v;
        this.setState(s);
    }

    constructor(props) {
        super(props);
        this.state = {
            address: "",
            amount: "",
            message: "",
            passphrase: "",
            currentBalance: "0"
        }
    }

    render() {
        return (
            <div className="Send-content">
                <div className="Send-title">- SEND -</div>
                <div className="Send-card-area">
                    <div className="Send-card">
                        <div className="Send-card-title">- amount -</div>
                        <div className="Send-card-content">*required*</div>
                        <div className="Send-card-content">
                            <input type="number" placeholder="min:0.1LSK / max:1000LSK" className="Send-input"
                                    value={this.state.amount}
                                    onChange={e => this.changeText(e, "amount")}
                                    required />
                        </div>
                        <br /><br />
                        <div className="Send-card-title">- message -</div>
                        <div className="Send-card-content">*optional*</div>
                        <div className="Send-card-content">
                            <input type="text" placeholder="max:50 characters" className="Send-input"
                                    value={this.state.message}
                                    onChange={e => this.changeText(e, "message")}
                                    maxLength="50" />
                        </div>
                        <br /><br />
                        <div className="Send-card-title">- your passphrase -</div>
                        <div className="Send-card-content">*required*</div>
                        <div className="Send-card-content">
                            <input type="password" placeholder="12 words separated by spaces" className="Send-input"
                                    value={this.state.passphrase}
                                    onChange={e => this.changeText(e, "passphrase")}
                                    required />
                        </div>
                        <button className="button Send-button" onClick={this.sendTransaction}><io.IoIosSend className="button-icon" />&nbsp;send</button>
                    </div>
                </div>
                <div className="Send-title">- CHECK BALANCE -</div>
                <div className="Send-card-area">
                    <div className="Send-card Send-check-balance">
                        <div className="Send-card-title">- your address -</div>
                        <div className="Send-card-content">
                            <input type="text" placeholder="Enter your address" className="Send-input"
                                    value={this.state.address}
                                    onChange={e => this.changeText(e, "address")}
                                    required />
                        </div>
                        <br /><br />
                        <div className="Send-card-title">- current balance -</div>
                        <div className="Send-card-content">{this.state.currentBalance} LSK</div>
                        <button className="button Send-button" onClick={this.findAccount}><io.IoIosSearch className="button-icon" />&nbsp;check</button>
                    </div>
                </div>
                <div className="Send-note">
                    <div className="Send-note-text">* If you do not have an account, try with the following account.</div>
                    <div className="Send-note-title">- address -</div>
                    <div className="Send-note-text">8273455169423958419L</div>
                    <div className="Send-note-title">- passphrase -</div>
                    <div className="Send-note-text">robust swift grocery peasant forget share enable convince deputy road keep cheap</div>
                </div>
                <button className="button" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
            </div>
        );
    }
}

export default Send;