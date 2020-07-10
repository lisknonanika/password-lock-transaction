import React from 'react';

import * as transactions from '@liskhq/lisk-transactions';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import * as io from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Receive.css';

import { utils } from 'password-lock-transaction-demo-server';
import { PasswordLockReceiveTransaction } from '@lisknonanika/password-lock-transaction';

class Receive extends React.Component {

    constructor(props) {
        super(props);
        let targetId = props.match.params.id === "dummy"? "": props.match.params.id;
        this.state = {
            status: 1,
            targetId: targetId || "",
            password: "",
            message: "",
            passphrase: "",
            id: "",
            address: "",
            currentBalance: "0"
        }
    }

    moveTop = () => {
        this.props.history.push('/');
    }

    findAccount = async() => {
        this.setState({currentBalance: "0"});
        if (!this.state.address) return;
        try {
            const res = await utils.getAccountByAddress(this.state.address);
            if (!res) return;
            if (res.message) toast(res.message);
            else this.setState({currentBalance: transactions.utils.convertBeddowsToLSK(res.balance)});
        } catch (err) {
            toast("failed");
            console.log(err);
        }
    }

    receiveTransaction = async() => {
        try {
            // check id
            const targetId = this.state.targetId;
            if (!targetId || targetId.length === 0) {
                toast("id required.");
                return;
            }

            // check password
            const password = this.state.password;
            if (!password || password.length === 0) {
                toast("PASSWORD required.");
                return;
            }

            // check message
            const message = this.state.message;
            if (message && message.length > 50) {
                toast("MESSAGE must be within 50 characters.");
                return;
            }

            // check passphrase
            const passphrase = this.state.passphrase;
            if (!passphrase || passphrase.length === 0) {
                toast("PASSPHRASE required.");
                return;
            }

            this.setState({status: 0});

            // get transaction
            const t = await utils.getTransactionById(this.state.targetId);
            if (!t) toast("ID not found.");
            else if (t.message) toast(t.message);
            if (!t || t.message) return;

            // exec receive transaction
            const param = {
                asset: {
                  recipientId: t.senderId,
                  data: {
                    targetTransactionId: this.state.targetId,
                    password: this.state.password,
                    message: this.state.message
                  }
                },
                fee: PasswordLockReceiveTransaction.FEE,
                networkIdentifier: utils.networkIdentifier,
                timestamp: utils.getTimestamp()
            }
            const tx = new PasswordLockReceiveTransaction(param);
            tx.sign(passphrase);
            const res = await utils.postTransaction(tx);
            if (!res) toast("failed.");
            else if (res.message) toast(res.message);
            else this.setState({status: 2, id: tx.id, password: tx.password});

        } catch (err) {
            toast("failed.");
            console.log(err);

        } finally {
            if (this.state.status === 0) this.setState({status: 1});
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

    render() {if (this.state.status === 0) {
        return (
            <div className="Receive-content">
                <Loader
                    type="RevolvingDot"
                    color="#4070F4"
                    height={100}
                    width={100}
                    className="App-loading"
                />
                <div className="Receive-note-text">wait a minutes.</div>
            </div>
        );
    } else if (this.state.status === 1) {
            return (
                <div className="Receive-content">
                    <div className="Receive-title">- NOTE-</div>
                    <div className="Receive-note">
                        <div className="Receive-note-text">
                            You will need the ID and PASSWORD to receive the LSK.<br />
                            If you do not have a Lisk account, create one.
                        </div>
                        <div className="Receive-note-link">
                            <a href={`/new-account/${this.state.targetId || "dummy"}`}>- Create Account -</a>
                        </div>
                    </div>
                    <div className="Receive-title">- RECEIVE -</div>
                    <div className="Receive-card-area">
                        <div className="Receive-card">
                            <div className="Receive-card-title">- ID -</div>
                            <div className="Receive-card-content">*required*</div>
                            <div className="Receive-card-content">
                                <input type="text" placeholder="enter the id" className="Receive-input"
                                        value={this.state.targetId}
                                        onChange={e => this.changeText(e, "targetId")}
                                        required />
                            </div>
                            <div className="Receive-card-title margin-top-20">- PASSWORD -</div>
                            <div className="Receive-card-content">*required*</div>
                            <div className="Receive-card-content">
                                <input type="text" placeholder="enter the password" className="Receive-input"
                                        value={this.state.password}
                                        onChange={e => this.changeText(e, "password")}
                                        required />
                            </div>
                            <div className="Receive-card-title margin-top-20">- MESSAGE -</div>
                            <div className="Receive-card-content">*optional*</div>
                            <div className="Receive-card-content">
                                <input type="text" placeholder="max:50 characters" className="Receive-input"
                                        value={this.state.message}
                                        onChange={e => this.changeText(e, "message")}
                                        maxLength="50" />
                            </div>
                            <div className="Receive-card-title margin-top-20">- YOUR PASSPHRASE -</div>
                            <div className="Receive-card-content">*required*</div>
                            <div className="Receive-card-content">
                                <input type="password" placeholder="12 words separated by spaces" className="Receive-input"
                                        value={this.state.passphrase}
                                        onChange={e => this.changeText(e, "passphrase")}
                                        required />
                            </div>
                            <button className="button Receive-button" onClick={this.receiveTransaction}><io.IoIosSend className="button-icon rotate-180" />&nbsp;Receive</button>
                        </div>
                    </div>
                    <div className="Receive-title">- CHECK BALANCE -</div>
                    <div className="Receive-card-area">
                        <div className="Receive-card Receive-check-balance">
                            <div className="Receive-card-title">- YOUR ADDRESS -</div>
                            <div className="Receive-card-content">
                                <input type="text" placeholder="Enter your address" className="Receive-input"
                                        value={this.state.address}
                                        onChange={e => this.changeText(e, "address")}
                                        required />
                            </div>
                            <div className="Receive-card-title margin-top-20">- CURRENT BALANCE -</div>
                            <div className="Receive-card-content">{this.state.currentBalance} LSK</div>
                            <button className="button Receive-button" onClick={this.findAccount}><io.IoIosSearch className="button-icon" />&nbsp;Check</button>
                        </div>
                    </div>
                    <div className="Receive-note margin-top-30">
                        <div className="Receive-note-text">If you do not have an account, try with the following account.</div>
                        <div className="Receive-note-title">- ADDRESS -</div>
                        <div className="Receive-note-text">8273455169423958419L</div>
                        <div className="Receive-note-title">- PASSPHRASE -</div>
                        <div className="Receive-note-text">robust swift grocery peasant forget share enable convince deputy road keep cheap</div>
                    </div>
                    <button className="button margin-top-40" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                </div>
            );
        } else if (this.state.status === 2) {
            return (
                <div className="Receive-content">
                    <div className="Receive-title">- RESULT -</div>
                    <div className="Receive-note">
                        <div className="Receive-note-text">
                            * This process takes about 15 seconds.
                        </div>
                        <div className="Receive-note-title">- ID -</div>
                        <div className="Receive-note-text">{this.state.id}</div>
                    </div>
                    <button className="button margin-top-40" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                </div>
            );
        }
    }
}

export default Receive;