import React from 'react';
import '../css/Top.css';

import {PasswordLockTransactionsConfig} from 'password-lock-transaction';

class Top extends React.Component {
    render() {
        return (
            <div className="card-area">
                <div className="card">
                    <div>
                        <div className="card-title">- Send -</div>
                        <div className="card-content">
                            fee: ${PasswordLockTransactionsConfig.fee.send} LSK
                            <br></br><br></br>
                            You need a balance of at least the amount + fee.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div>
                        <div className="card-title">- Cancel -</div>
                        <div className="card-content">
                            fee: ${PasswordLockTransactionsConfig.fee.cancel} LSK
                            <br></br><br></br>
                            You can only cancel the LSK that you sent.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div>
                        <div className="card-title">- Receive -</div>
                        <div className="card-content">
                            fee: ${PasswordLockTransactionsConfig.fee.receive} LSK
                            <br></br><br></br>
                            You will need the ID and PASSWORD provided by the sender.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Top;