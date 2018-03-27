import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Jyanken from './Jyanken'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import { Tabs, Tab } from 'material-ui/Tabs'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

class JyankenGamePage extends Component {
  constructor(props) {
    super(props)

    this.jyanken = new Jyanken()
    this.state = {
      scores: [],
      status: {},
      tabIndex: 0
    }
  }

  componentDidMount() {
    this.getResult()
  }

  tabChange(i) {
    this.setState({tabIndex: i})
    this.getResult()
  }

  getResult() {
    this.setState({scores: this.jyanken.getScores()})
    this.setState({status: this.jyanken.getStatuses()})
  }

  pon(hand) {
    this.jyanken.pon(hand)
    this.getResult()
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Title>じゃんけん PON!!</Title>
          <JyankenBox actionPon={(hand) => this.pon(hand)} />
          <Paper style={{width: 600}} zDepth={2}>
            <Tabs value={this.state.tabIndex} onChange={ix => this.tabChange(ix)}>
              <Tab label='対戦結果' value={0}>
                <ScoreList scores={this.state.scores} />
              </Tab>
              <Tab label='対戦成績' value={1}>
                <StatusBox status={this.state.status} />
              </Tab>
            </Tabs>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}

const JyankenBox = (props) => {
  return (
    <div>
      <RaisedButton label='👊グー' onClick={() => props.actionPon(0)} />
      <RaisedButton label='✌️チョキ' onClick={() => props.actionPon(1)} />
      <RaisedButton label='🖐パー' onClick={() => props.actionPon(2)} />
    </div>
  )
}

JyankenBox.propTypes = {
  actionPon: PropTypes.func.isRequired
}

const ScoreList = (props) => {
  return (
    <Table>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn>時間</TableHeaderColumn>
          <TableHeaderColumn>人間</TableHeaderColumn>
          <TableHeaderColumn>コンピューター</TableHeaderColumn>
          <TableHeaderColumn>結果</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.scores.map((score, i) => <ScoreListItem key={i} score={score} />)}
      </TableBody>
    </Table>
  )
}

ScoreList.propTypes = {
  scores: PropTypes.array
}

const ScoreListItem = (props) => {
  const HANDS = ['👊グー', '✌️チョキ', '🖐パー']
  const JUDGMENTS = ['引き分け', '勝ち', '負け']
  const dateHHMMSS = d => d.toTimeString().substr(0, 8)

  return (
    <TableRow style={judgmentStyle(props.score.judgment || 0)}>
      <TableRowColumn>{dateHHMMSS(props.score.createdAt)}</TableRowColumn>
      <TableRowColumn>{HANDS[props.score.human]}</TableRowColumn>
      <TableRowColumn>{HANDS[props.score.computer]}</TableRowColumn>
      <TableRowColumn>{JUDGMENTS[props.score.judgment]}</TableRowColumn>
    </TableRow>
  )
}

ScoreListItem.propTypes = {
  score: PropTypes.object
}

const StatusBox = (props) => {
  return (
    <Table>
      <TableBody displayRowCheckbox={false}>
        <TableRow displayBorder={false}>
          <TableHeaderColumn>勝ち</TableHeaderColumn>
          <TableRowColumn style={judgmentStyle(1)}>{props.status.win}</TableRowColumn>
        </TableRow>
        <TableRow displayBorder={false}>
          <TableHeaderColumn>負け</TableHeaderColumn>
          <TableRowColumn style={judgmentStyle(2)}>{props.status.lose}</TableRowColumn>
        </TableRow>
        <TableRow displayBorder={false}>
          <TableHeaderColumn>引き分け</TableHeaderColumn>
          <TableRowColumn style={judgmentStyle(0)}>{props.status.draw}</TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  )
}

StatusBox.propTypes = {
  status: PropTypes.object
}

const judgmentStyle = judgment => {
  return (
    {color: ['#000', '#2979ff', '#ff1744'][judgment]}
  )
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
        <MoneyEntry2 add={(date, item, amount) => this.addBook(date, item, amount)} />
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
    this.setState({date: '', item: '', amount: '', payingIn})
  }

  render() {
    return (
      <Fragment>
        <fieldset>
          <legend>記帳</legend>
          <div>
            入金<input type='radio' value='on' checked={this.state.payingIn} onChange={(e) => this.onChangePayingIn(e)} />
            出金<input type='radio' value='off' checked={!this.state.payingIn} onChange={(e) => this.onChangePayingIn(e)} />
          </div>
          <div>
            日付:<input type='text' name='date' value={this.state.date} onChange={(e) => this.onChangeText(e)} placeholder='3/15' />
          </div>
          <div>
            項目:<input type='text' name='item' value={this.state.item} onChange={(e) => this.onChangeText(e)} placeholder='お小遣い' />
          </div>
          <div>
            金額:<input type='text' name='amount' value={this.state.amount} onChange={(e) => this.onChangeText(e)} placeholder='1000' />
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

class MoneyEntry2 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: null,
      item: null,
      amount: null,
      payingIn: null
    }
  }

  onClickSubmit() {
    this.props.add(
      this.date.value,
      this.item.value,
      this.amount.value * (this.payingIn.checked ? 1 : -1)
    )

    this.setState({
      date: '',
      item: '',
      amount: '',
      payingIn: ''
    })
  }

  render() {
    return (
      <Fragment>
        <fieldset>
          <legend>記帳</legend>
          <div>
            入金<input type='radio' defaultChecked name='payingIn' ref={(node) => this.payingIn = node} />
            出金<input type='radio' name='payingIn' />
          </div>
          <div>
            日付:<input type='text' defaultValue='' ref={(node) => this.date = node} placeholder='3/15' />
          </div>
          <div>
            項目:<input type='text' defaultValue='' ref={(node) => this.item = node} placeholder='お小遣い' />
          </div>
          <div>
            金額:<input type='text' defaultValue='' ref={(node) => this.amount = node} placeholder='1000' />
          </div>
          <div>
            <input type='submit' value='追加' onClick={() => this.onClickSubmit()} />
          </div>
        </fieldset>
      </Fragment>
    )
  }
}

MoneyEntry2.propTypes = {
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