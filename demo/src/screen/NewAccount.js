import React from 'react';

import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import '../css/NewAccount.css';

class NewAccount extends React.Component {

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
        this.state = this.createAcount();
    }

    render() {
        return (
            <div className="new-account-content">
                <div className="title">- NOTE-</div>
                <div className="note">
                    <div className="note-text">
                        Please make a note of the address and passphrase so that you do not forget them.<br />
                        We do not manage passphrases.<br />
                        If you forget your passphrase, you will not be able to access your account.
                    </div>
                </div>
                <div className="title">- YOUR NEW ACCOUNT-</div>
                <div className="card-area">
                    <div className="card">
                        <div className="card-title">- address -</div>
                        <div className="card-content">{this.state.address}</div>
                        <br /><br />
                        <div className="card-title">- passphrase -</div>
                        <div className="card-content">{this.state.passphrase}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewAccount;