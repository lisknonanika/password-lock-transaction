import React from 'react';

import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import { FiArrowRightCircle } from 'react-icons/fi';
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
                <div>passphrase:{this.state.passphrase} </div>
                <div>address:{this.state.address}</div>
            </div>
        );
    }
}

export default NewAccount;