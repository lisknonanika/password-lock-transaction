import React from 'react';

import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';

class NewAccount extends React.Component {

    constructor(props) {
        super(props);
        const passphrase = Mnemonic.generateMnemonic();
        const address = getAddressFromPassphrase(passphrase);
        this.state = {
            passphrase: passphrase,
            address: address
        }
    }

    render() {
        return (
            <div>
                <div>passphrase:{this.state.passphrase} </div>
                <div>address:{this.state.address}</div>
            </div>
        );
    }
}

export default NewAccount;