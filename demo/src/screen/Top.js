import React from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';
import '../css/Top.css';

import {PasswordLockTransactionsConfig} from 'password-lock-transaction';

class Top extends React.Component {

    createAccount = () => {
        this.props.history.push('/new-account');
    }

    render() {
        return (
            <div className="Top-content">
                <div className="Top-title">- NOTE-</div>
                <div className="Top-note">
                    <div className="Top-note-text">
                        PLT is PoC built with Lisk SDK.<br />
                        (PLT = Password Lock Transaction)<br />
                        The LSK obtained here can only be used in this project.
                    </div>
                    <div>
                        <a href="https://lisk.io" target="_" className="Top-note-link">What is Lisk ?</a>
                    </div>
                </div>
                <div className="Top-title">- MENU -</div>
                <div className="Top-card-area">
                    <div className="Top-card Top-menu-card">
                        <div className="Top-card-title">- Send -</div>
                        <div className="Top-card-content">
                            fee: ${PasswordLockTransactionsConfig.fee.send} LSK
                            <br /><br />
                            You need a balance of at least the amount + fee.
                        </div>
                        <div className="Top-card-icon"><FiArrowRightCircle /></div>
                    </div>
                    <div className="Top-card Top-menu-card">
                        <div className="Top-card-title">- Cancel -</div>
                        <div className="Top-card-content">
                            fee: ${PasswordLockTransactionsConfig.fee.cancel} LSK
                            <br /><br />
                            You can only cancel the LSK that you sent.
                        </div>
                        <div className="Top-card-icon"><FiArrowRightCircle /></div>
                    </div>
                    <div className="Top-card Top-menu-card">
                        <div className="Top-card-title">- Receive -</div>
                        <div className="Top-card-content">
                            fee: ${PasswordLockTransactionsConfig.fee.receive} LSK
                            <br /><br />
                            You will need the ID and PASSWORD provided by the sender.
                        </div>
                        <div className="Top-card-icon"><FiArrowRightCircle /></div>
                    </div>
                </div>
                <div className="Top-card Top-new-account-card" onClick={this.createAccount}>
                    <div className="Top-card-title">- Create Account -</div>
                    <div className="Top-card-content">
                        To use PLT, you need a Lisk account.
                        <br />
                        Are you create the new Lisk account?
                    </div>
                    <div className="Top-card-icon"><FiArrowRightCircle /></div>
                </div>
            </div>
        );
    }
}

export default Top;