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
        <Title>じゃんけん PON!!</Title>
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

class MoneyBook extends Component {
  constructor(props) {
    super(props)

    this.state = {
      books: []
    }
  }

  componentDidMount() {
    this.setState({
      books: [
        {date: '1/1', item: 'お年玉', amount: 15000},
        {date: '1/10', item: '飲み会', amount: -4000},
        {date: '1/31', item: 'お小遣い', amount: 100000},
        {date: '2/9', item: '誕生日', amount: 5000},
        {date: '2/11', item: '飲み会', amount: -5000},
      ]
    })
  }

  addBook(date, item, amount) {
    const book = {date, item, amount}

    this.setState({
      books: this.state.books.concat(book)
    })
  }

  render() {
    return (
      <Fragment>
        <Title>お小遣い帳</Title>
        <MoneyBookList books={this.state.books} />
        <MoneyEntry add={(date, item, amount) => this.addBook(date, item, amount)} />
      </Fragment>
    )
  }
}

const MoneyBookList = (props) => {
  return (
    <Fragment>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>入金</th>
            <th>出金</th>
          </tr>
        </thead>
        <tbody>
          {props.books.map((book, i) => <MoneyItemList key={i} book={book} />)}
        </tbody>
      </table>
    </Fragment>
  )
}

MoneyBookList.propTypes = {
  books: PropTypes.array.isRequired
}

const MoneyItemList = (props) => {
  return (
    <tr>
      <td>{props.book.date}</td>
      <td>{props.book.item}</td>
      <td>{props.book.amount}</td>
    </tr>
  )
}

MoneyItemList.propTypes = {
  book: PropTypes.object.isRequired
}

class MoneyEntry extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: '',
      item: '',
      amount: '',
      payingIn: true
    }
  }

  onChangeText(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  onChangePayingIn(event) {
    this.setState({payingIn: event.target.value === 'on'})
  }

  onClickSubmit() {
    const {date, item, amount, payingIn } = this.state

    this.props.add(date, item, amount * (payingIn ? 1 : -1))
    this.setState({date: '', item: '', amount: '', payingIn: false})
  }

  render() {
    return (
      <Fragment>
        <fieldset>
          <legend>記帳</legend>
          <div>
            <input
              type='radio'
              value='on'
              checked={this.state.payingIn}
              onChange={(e) => this.onChangePayingIn(e)}
              />
            <input
              type='radio'
              value='off'
              checked={!this.state.payingIn}
              onChange={(e) => this.onChangePayingIn(e)}
              />
          </div>
          <div>
            日付:
            <input
              type='text'
              name='date'
              value={this.state.text}
              onChange={(e) => this.onChangeText(e)}
              placeholder='3/15'
              />
          </div>
          <div>
            項目:
            <input
              type='text'
              name='item'
              value={this.state.item}
              onChange={(e) => this.onChangeText(e)}
              placeholder='お小遣い'
              />
          </div>
          <div>
            金額:
            <input
              type='text'
              name='amount'
              value={this.state.amount}
              onChange={(e) => this.onChangeText(e)}
              placeholder='1000'
              />
          </div>
          <div>
            <input type='submit' value='追加' onClick={() => this.onClickSubmit()} />
          </div>
        </fieldset>
      </Fragment>
    )
  }
}

MoneyEntry.propTypes = {
  add: PropTypes.func.isRequired
}

const Title = (props) => {
  return (
    <h1>{props.children}</h1>
  )
}

Title.propTypes = {
  children: PropTypes.string.isRequired
}

ReactDOM.render(
  <Fragment>
    <JyankenGamePage />
    <MoneyBook />
  </Fragment>,
  document.getElementById('root')
)