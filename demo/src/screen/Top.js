import React from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';
import '../css/Top.css';

import {PasswordLockTransactionsConfig} from 'password-lock-transaction';

class Top extends React.Component {

    render() {
        return (
            <div className="top-content">
                <div className="title">- NOTE-</div>
                <div className="note">
                    <div className="note-text">
                        PLT is PoC built with Lisk SDK.<br></br>
                        (PLT = Password Lock Transaction)<br></br>
                        The LSK obtained here can only be used in this project.
                    </div>
                    <div>
                        <a href="https://lisk.io" target="_" className="note-link">What is Lisk ?</a>
                    </div>
                </div>
                <div className="title">- MENU -</div>
                <div className="card-area">
                    <div className="card">
                        <div>
                            <div className="card-title">- Send -</div>
                            <div className="card-content">
                                fee: ${PasswordLockTransactionsConfig.fee.send} LSK
                                <br /><br />
                                You need a balance of at least the amount + fee.
                            </div>
                            <div className="card-icon"><FiArrowRightCircle /></div>
                        </div>
                    </div>
                    <div className="card">
                        <div>
                            <div className="card-title">- Cancel -</div>
                            <div className="card-content">
                                fee: ${PasswordLockTransactionsConfig.fee.cancel} LSK
                                <br /><br />
                                You can only cancel the LSK that you sent.
                            </div>
                            <div className="card-icon"><FiArrowRightCircle /></div>
                        </div>
                    </div>
                    <div className="card">
                        <div>
                            <div className="card-title">- Receive -</div>
                            <div className="card-content">
                                fee: ${PasswordLockTransactionsConfig.fee.receive} LSK
                                <br /><br />
                                You will need the ID and PASSWORD provided by the sender.
                            </div>
                            <div className="card-icon"><FiArrowRightCircle /></div>
                        </div>
                    </div>
                </div>
                <div className="card new-account-card">
                    <div>
                        <div className="card-title">- New Account -</div>
                        <div className="card-content">
                            PLT is Not available if you do not have a Lisk account.
                            <br />
                            Are you create the new Lisk account?
                        </div>
                        <div className="card-icon"><FiArrowRightCircle /></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Top;