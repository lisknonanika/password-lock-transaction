import React from 'react';

import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import * as io from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Cancel.css';

import { utils } from 'password-lock-transaction-demo-server';
import { PasswordLockCancelTransaction } from 'password-lock-transaction';

class Cancel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            targetId: "",
            passphrase: "",
            id: ""
        }
    }

    moveTop = () => {
        this.props.history.push('/');
    }

    cancelTransaction = async() => {
        try {
            // check id
            const targetId = this.state.targetId;
            if (!targetId || targetId.length === 0) {
                toast("id required.");
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

            // exec Cancel transaction
            const param = {
                asset: {
                    data: {
                        targetTransactionId: this.state.targetId
                    }
                },
                fee: PasswordLockCancelTransaction.FEE,
                networkIdentifier: utils.networkIdentifier,
                timestamp: utils.getTimestamp()
            }
            const tx = new PasswordLockCancelTransaction(param);
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
            <div className="Cancel-content">
                <Loader
                    type="RevolvingDot"
                    color="#4070F4"
                    height={100}
                    width={100}
                    className="App-loading"
                />
                <div className="Cancel-note-text">wait a minutes.</div>
            </div>
        );
    } else if (this.state.status === 1) {
            return (
                <div className="Cancel-content">
                    <div className="Cancel-title">- Cancel -</div>
                    <div className="Cancel-card-area">
                        <div className="Cancel-card">
                            <div className="Cancel-card-title">- ID -</div>
                            <div className="Cancel-card-content">*required*</div>
                            <div className="Cancel-card-content">
                                <input type="text" placeholder="enter the id" className="Cancel-input"
                                        value={this.state.targetId}
                                        onChange={e => this.changeText(e, "targetId")}
                                        required />
                            </div>
                            <br /><br />
                            <div className="Cancel-card-title margin-top-20">- YOUR PASSPHRASE -</div>
                            <div className="Cancel-card-content">*required*</div>
                            <div className="Cancel-card-content">
                                <input type="password" placeholder="12 words separated by spaces" className="Cancel-input"
                                        value={this.state.passphrase}
                                        onChange={e => this.changeText(e, "passphrase")}
                                        required />
                            </div>
                            <button className="button Cancel-button" onClick={this.cancelTransaction}><io.IoMdCloseCircleOutline />&nbsp;Cancel</button>
                        </div>
                    </div>
                    <button className="button" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                </div>
            );
        } else if (this.state.status === 2) {
            return (
                <div className="Cancel-content">
                    <div className="Cancel-title">- RESULT -</div>
                    <div className="Cancel-note">
                        <div className="Cancel-note-text">
                            * This process takes about 15 seconds.
                        </div>
                        <div className="Cancel-note-title">- ID -</div>
                        <div className="Cancel-note-text">{this.state.id}</div>
                    </div>
                    <button className="button" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                </div>
            );
        }
    }
}

export default Cancel;