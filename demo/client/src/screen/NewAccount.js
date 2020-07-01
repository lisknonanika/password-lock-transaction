import React from 'react';

import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import * as io from 'react-icons/io';
import '../css/NewAccount.css';

class NewAccount extends React.Component {

    moveTop = () => {
        this.props.history.push('/');
    }

    moveReceive = () => {
        const targetId = this.state.id === "dummy"? "": this.state.id;
        this.props.history.push(`/receive/${targetId}`);
    }

    createAcount = () => {
        const passphrase = Mnemonic.generateMnemonic();
        const address = getAddressFromPassphrase(passphrase);
        return  {
            passphrase: passphrase,
            address: address
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.createAcount(),
            id: props.match.params.id || ""
        }
    }

    render() {
        const BackButton = () => {
            if (this.state.id) {
                return (
                    <button className="button" onClick={this.moveReceive}><io.IoIosSend className="button-icon rotate-180" />&nbsp;Move To Receive</button>
                );
            } else {
                return (
                    <button className="button" onClick={this.moveTop}><io.IoMdHome className="button-icon" />&nbsp;Move to Top</button>
                );
            }
        }
        return (
            <div className="NewAccount-content">
                <div className="NewAccount-title">- NOTE-</div>
                <div className="NewAccount-note">
                    <div className="NewAccount-note-text">
                        Please make a note of the ADDRESS and PASSPHRASE.<br />
                        If you forget your passphrase, you will not be able to access your account.
                    </div>
                </div>
                <div className="NewAccount-title">- YOUR NEW ACCOUNT-</div>
                <div className="NewAccount-card-area">
                    <div className="NewAccount-card">
                        <div className="NewAccount-card-title">- ADDRESS -</div>
                        <div className="NewAccount-card-content">{this.state.address}</div>
                        <br /><br />
                        <div className="NewAccount-card-title margin-top-20">- PASSPHRASE -</div>
                        <div className="NewAccount-card-content">{this.state.passphrase}</div>
                    </div>
                </div>
                <BackButton />
            </div>
        );
    }
}

export default NewAccount;