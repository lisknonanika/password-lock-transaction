import React from 'react';

import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import * as io from 'react-icons/io';
import '../css/Send.css';

class Send extends React.Component {

    moveTop = () => {
        this.props.history.push('/');
    }

    changeText = (e, name) => {
        this.state[name] = e.target.value;
        this.setState(this.state);
    }

    constructor(props) {
        super(props);
        this.state = {
            address: "",
            amount: "",
            messaeg: "",
            passphrase: "",
            currentBalancd: "0"
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
                        <div className="Send-card-title">- messaeg -</div>
                        <div className="Send-card-content">*optional*</div>
                        <div className="Send-card-content">
                            <input type="text" placeholder="max:255 characters" className="Send-input"
                                    value={this.state.message}
                                    onChange={e => this.changeText(e, "message")} />
                        </div>
                        <br /><br />
                        <div className="Send-card-title">- your passphrase -</div>
                        <div className="Send-card-content">*required*</div>
                        <div className="Send-card-content">
                            <input type="text" placeholder="12 words separated by spaces" className="Send-input"
                                    value={this.state.passphrase}
                                    onChange={e => this.changeText(e, "passphrase")}
                                    required />
                        </div>
                        <button className="Send-button" onClick={this.moveTop}><io.IoIosSend className="button-icon" />&nbsp;send</button>
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
                        <div className="Send-card-content">{this.state.currentBalancd} LSK</div>
                        <button className="Send-button" onClick={this.moveTop}><io.IoIosSearch className="button-icon" />&nbsp;check</button>
                    </div>
                </div>
                <div className="Send-note">
                    <div className="Send-note-text">* If you do not have an account, try with the following account.</div>
                    <div className="Send-note-title">- address -</div>
                    <div className="Send-note-text">8273455169423958419L</div>
                    <div className="Send-note-title">- passphrase -</div>
                    <div className="Send-note-text">robust swift grocery peasant forget share enable convince deputy road keep cheap</div>
                </div>
                <button onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
            </div>
        );
    }
}

export default Send;