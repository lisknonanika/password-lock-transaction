import React from 'react';

import * as transactions from '@liskhq/lisk-transactions';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import Loader from 'react-loader-spinner';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import * as io from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Send.css';

import { baseURL } from '../config';
import { utils } from 'password-lock-transaction-demo-server';
import { PasswordLockSendTransaction } from '@lisknonanika/password-lock-transaction';

class Send extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            amount: "",
            message: "",
            passphrase: "",
            id: "",
            password: "",
            sendParam: {},
            address: "",
            currentBalance: "0"
        }
    }

    mailBody = () => {
        let body = `\n`;
        body += `\n`;
        body += `\n`;
        body += `*************************\n`;
        body += `* PLT Auto Message\n`;
        body += `*************************\n`;
        body += `You can receive ${this.state.sendParam.amount} LSK.\n`;
        body += `To receive the LSK, please access the URL below and enter the password that you received in the email.\n`;
        body += `\n`;
        body += `* URL\n`;
        body += `${baseURL}/receive/${this.state.id}\n`;
        body += `\n`;
        body += `* Password\n`;
        body += `${this.state.password}\n`;
        if (this.state.sendParam.message) {
            body += `\n`;
            body += `* Message from sender\n`;
            body += `${this.state.sendParam.message}\n`;
        }
        body += `\n`;
        body += `\n`;
        return encodeURIComponent(body);
    }

    copyInfo = () => {
        let body = ``;
        body += `* URL\n`;
        body += `${baseURL}/receive/${this.state.id}\n`;
        body += `* Password\n`;
        body += `${this.state.password}\n`;
        body += `* Amount\n`;
        body += `${this.state.sendParam.amount}\n`;
        if (this.state.sendParam.message) {
            body += `* Message\n`;
            body += `${this.state.sendParam.message}\n`;
        }
        return body;
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

    sendTransaction = async() => {
        try {
            // check amount
            const amount = this.state.amount;
            if (!amount || amount.length === 0 || amount < 0.1 || amount > 1000) {
                toast("AMOUNT must be in the range 0.1 to 1000.");
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

            // exec send transaction
            this.setState({status: 0});
            const param = {
                asset: {
                    amount: transactions.utils.convertLSKToBeddows(this.state.amount),
                    data: {
                        senderId: getAddressFromPassphrase(passphrase),
                        amount: +this.state.amount,
                        message: this.state.message
                    }
                },
                fee: PasswordLockSendTransaction.FEE,
                networkIdentifier: utils.networkIdentifier,
                timestamp: utils.getTimestamp()
            }
            const tx = new PasswordLockSendTransaction(param);
            tx.sign(passphrase);
            const res = await utils.postTransaction(tx);
            if (!res) toast("failed.");
            else if (res.message) toast(res.message);
            else this.setState({status: 2, id: tx.id, password: tx.password, sendParam: param.asset.data});

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
            <div className="Send-content">
                <Loader
                    type="RevolvingDot"
                    color="#4070F4"
                    height={100}
                    width={100}
                    className="App-loading"
                />
                <div className="Send-note-text">wait a minutes.</div>
            </div>
        );
    } else if (this.state.status === 1) {
            return (
                <div className="Send-content">
                    <div className="Send-title">- SEND -</div>
                    <div className="Send-card-area">
                        <div className="Send-card">
                            <div className="Send-card-title">- AMOUNT -</div>
                            <div className="Send-card-content">*required*</div>
                            <div className="Send-card-content">
                                <input type="number" placeholder="min:0.1LSK / max:1000LSK" className="Send-input"
                                        value={this.state.amount}
                                        onChange={e => this.changeText(e, "amount")}
                                        required />
                            </div>
                            <div className="Send-card-title margin-top-20">- MESSAGE -</div>
                            <div className="Send-card-content">*optional*</div>
                            <div className="Send-card-content">
                                <input type="text" placeholder="max:50 characters" className="Send-input"
                                        value={this.state.message}
                                        onChange={e => this.changeText(e, "message")}
                                        maxLength="50" />
                            </div>
                            <div className="Send-card-title margin-top-20">- YOUR PASSPHRASE -</div>
                            <div className="Send-card-content">*required*</div>
                            <div className="Send-card-content">
                                <input type="password" placeholder="12 words separated by spaces" className="Send-input"
                                        value={this.state.passphrase}
                                        onChange={e => this.changeText(e, "passphrase")}
                                        required />
                            </div>
                            <button className="button Send-button" onClick={this.sendTransaction}><io.IoIosSend className="button-icon" />&nbsp;Send</button>
                        </div>
                    </div>
                    <div className="Send-title">- CHECK BALANCE -</div>
                    <div className="Send-card-area">
                        <div className="Send-card Send-check-balance">
                            <div className="Send-card-title">- YOUR ADDRESS -</div>
                            <div className="Send-card-content">
                                <input type="text" placeholder="Enter your address" className="Send-input"
                                        value={this.state.address}
                                        onChange={e => this.changeText(e, "address")}
                                        required />
                            </div>
                            <div className="Send-card-title margin-top-20">- CURRENT BALANCE -</div>
                            <div className="Send-card-content">{this.state.currentBalance} LSK</div>
                            <button className="button Send-button" onClick={this.findAccount}><io.IoIosSearch className="button-icon" />&nbsp;Check</button>
                        </div>
                    </div>
                    <div className="Send-note">
                        <div className="Send-note-text">If you do not have an account, try with the following account.</div>
                        <div className="Send-note-title">- ADDRESS -</div>
                        <div className="Send-note-text">8273455169423958419L</div>
                        <div className="Send-note-title">- PASSPHRASE -</div>
                        <div className="Send-note-text">robust swift grocery peasant forget share enable convince deputy road keep cheap</div>
                    </div>
                    <button className="button" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                </div>
            );
        } else if (this.state.status === 2) {
            return (
                <div className="Send-content">
                    <div className="Send-title">- RESULT -</div>
                    <div className="Send-note margin-top-0">
                        <div className="Send-note-text">
                            Please tell this content to the other party.<br />
                            It's a good idea to take a screenshot to make sure you don't forget.<br />
                            * This process takes about 15 seconds.
                        </div>
                        <div className="Send-note-title">- ID -</div>
                        <div className="Send-note-text">{this.state.id}</div>
                        <div className="Send-note-title">- PASSWORD -</div>
                        <div className="Send-note-text">{this.state.password}</div>
                        <div className="Send-note-title">- RECEIVE URL -</div>
                        <div className="Send-note-text" style={{wordBreak: "break-all"}}>{baseURL}/receive/{this.state.id}</div>
                        <div className="Send-note-title">- SENDER -</div>
                        <div className="Send-note-text">{this.state.sendParam.senderId}</div>
                        <div className="Send-note-title">- AMOUNT -</div>
                        <div className="Send-note-text">{this.state.sendParam.amount} LSK</div>
                        <div className="Send-note-title">- MESSAGE -</div>
                        <div className="Send-note-text">{this.state.sendParam.message || "none message"}</div>
                        <div className="Send-note-text margin-top-30">
                            <a href={"mailto:?body=" + this.mailBody()} style={{"textDecoration": "none"}}><io.IoIosMail className="button-icon" /></a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <CopyToClipboard text={this.copyInfo()} onCopy={() => toast("Copied!")}>
                                <io.IoIosCopy className="button-icon" style={{color: "#bacdf8", fontWeight: "bold", cursor: "pointer"}} />
                            </CopyToClipboard>
                        </div>
                    </div>
                    <button className="button" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                </div>
            );
        }
    }
}

export default Send;