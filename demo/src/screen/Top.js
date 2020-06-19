import React from 'react';

class Top extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            textValue: ''
        }
        this.changeText = this.changeText.bind(this);
    }

    changeText(e) {
        this.setState({textValue: e.target.value});
    }

    render() {
        return (
            <div>
                <input type="text" className="input-address" placeholder="Enter your Lisk Address" value={this.state.textValue} onChange={this.changeText} />
            </div>
        );
    }
}

export default Top;