import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class JyankenGamePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      human: null,
      computer: null
    }
  }

  pon(humanHand) {
    const computerHand = Math.floor(Math.random() * 3)

    this.setState({
      human: humanHand,
      computer: computerHand
    })
  }

  judge() {
    const { human, computer } = this.state

    if (human === null) return null
    return (computer - human + 3) % 3
  }

  render() {
    const { human, computer } = this.state

    return (
      <Fragment>
        <h1>じゃんけん PON!!</h1>
        <JyankenBox actionPon={(hand) => this.pon(hand)} />
        <ScoreBox human={human} computer={computer} judgment={this.judge()} />
      </Fragment>
    )
  }
}

const JyankenBox = (props) => {
  return (
    <Fragment>
      <button onClick={() => props.actionPon(0)}>👊グー</button>
      <button onClick={() => props.actionPon(1)}>✌️チョキ</button>
      <button onClick={() => props.actionPon(2)}>🖐パー</button>
    </Fragment>
  )
}

JyankenBox.propTypes = {
  actionPon: PropTypes.func.isRequired
}

const ScoreBox = (props) => {
  const HANDS = ['👊グー', '✌️チョキ', '🖐パー']
  const JUDGMENTS = ['引き分け', '勝ち', '負け']

  return (
    <table>
      <tbody>
        <tr>
          <th>あなた</th><td>{HANDS[props.human]}</td>
          <th>コンピュータ</th><td>{HANDS[props.computer]}</td>
          <th>勝敗</th><td>{JUDGMENTS[props.judgment]}</td>
        </tr>
      </tbody>
    </table>
  )
}

ScoreBox.propTypes = {
  human: PropTypes.number,
  computer: PropTypes.number,
  judgment: PropTypes.number
}

ReactDOM.render(
  <JyankenGamePage />,
  document.getElementById('root')
)