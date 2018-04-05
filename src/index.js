import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom'
import Jyanken from './Jyanken'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { List, ListItem } from 'material-ui/List'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import WeatherIcon from 'material-ui/svg-icons/image/wb-sunny'
import TemperatureIcon from 'material-ui/svg-icons/editor/show-chart'


class JyankenGame extends Component {
  constructor(props) {
    super(props)

    this.jyanken = new Jyanken()
    this.state = {
      scores: [],
      status: {}
    }
  }

  componentDidMount() {
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
    const tabStyle = { width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4' }
    const activeStyle = (path) => {
      const active = this.props.location.pathname.match(path)
      return Object.assign({ borderBottom: `solid 2px ${active ? '#f00' : '#01bcd4'}` }, tabStyle)
    }

    return (
      <MuiThemeProvider>
        <div>
          <Title>じゃんけん PON!!</Title>
          <JyankenBox actionPon={(hand) => this.pon(hand)} />
          <Paper style={{width: 400}} zDepth={2}>
            <Link to='/jyankenGame/scores'>
              <FlatButton label='対戦結果' style={activeStyle('scores')} />
            </Link>
            <Link to='/jyankenGame/status'>
              <FlatButton label='対戦成績' style={activeStyle('status')} />
            </Link>
            <Route path='/jyankenGame/scores' component={() => <ScoreList scores={this.state.scores} />} />
            <Route path='/jyankenGame/status' component={() => <StatusBox status={this.state.status} />} />
            <Route exact path='/jyankenGame' component={() => <Redirect to='/jyankenGame/scores' />} />
          </Paper>
          <Footer />
        </div>
      </MuiThemeProvider>
    )
  }
}

JyankenGame.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
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
        <Footer />
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

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placeName: null,
      weather: null,
      temperature: null,
      loading: false
    }

    this.Places = [
      { name: '札幌', id: 2128295 },
      { name: '東京', id: 1850147 },
      { name: '大阪', id: 1853909 },
      { name: '沖縄', id: 1894616 }
    ]

    this.OpenWeatherMapKey ='66deddadca5c2aab305f4b838e9db87f'
  }

  selectPlace(index) {
    if (index > 0) {
      const place = this.Places[index - 1]
      this.setState({
        placeName: place.name,
        weather: null,
        temperature: null,
        loading: true
      })
      this.getWeather(place.id)
    }
  }

  getWeather(cityId) {
    const delay = (mSec) => new Promise((resolve) => setTimeout(resolve, mSec))

    fetch(`http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${this.OpenWeatherMapKey}&lang=ja&units=metric`)
    .then((response) => response.json())
    .then((json) => {
      delay(700)
      .then(() => this.setState({
        weather: json.weather[0].description,
        temperature: json.main.temp,
        loading: false
      }))
    })
    .catch((response) => {
      this.setState({ loading: false })
      console.log('*** ERROR ***', response)
    })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Card style={{margin: 30}}>
            <CardHeader title={<WeatherTitle placeName={this.state.placeName} />} />
            <CardText style={{ position: 'relative' }}>
              <RefreshIndicator status={this.state.loading ? 'loading' : 'hide' } top={40} left={100} loadingColor='#f00' />
              <WeatherInfomation weather={this.state.weather} temperature={this.state.temperature} />
            </CardText>
            <CardActions>
              <PlaceSelector places={this.Places} actionSelect={(i) => this.selectPlace(i)} />
            </CardActions>
          </Card>
          <Footer />
        </div>
      </MuiThemeProvider>
    )
  }
}

const WeatherTitle = (props) => <Title>{props.placeName ? `${props.placeName}の天気` : '天気情報'}</Title>

WeatherTitle.propTypes = {
  placeName: PropTypes.string
}

const WeatherInfomation = (props) => {
  return (
    <List>
      <ListItem leftIcon={<WeatherIcon />} primaryText={props.weather} />
      <ListItem leftIcon={<TemperatureIcon />} primaryText={props.temperature ? `${props.temperature} ℃` : ''} />
    </List>
  )
}

WeatherInfomation.propTypes = {
  weather: PropTypes.string,
  temperature: PropTypes.number
}

const PlaceSelector = (props) => {
  return (
    <DropDownMenu value={-1} onChange={(event, i) => props.actionSelect(i)}>
      <MenuItem value={-1} primaryText='場所を選択' />
      {props.places.map((place, i) => <MenuItem key={i} value={i} primaryText={place.name} />)}
    </DropDownMenu>
  )
}

PlaceSelector.propTypes = {
  places: PropTypes.array,
  actionSelect: PropTypes.func.isRequired
}

const Title = (props) => <h1>{props.children}</h1>

Title.propTypes = {
  children: PropTypes.string.isRequired
}

const Footer = () => {
  return (
    <Fragment>
      <Link to='/moneyBook'>moneyBook</Link>
      <Link to='/jyankenGame'>jyankenGame</Link>
      <Link to='/weather'>weather</Link>
    </Fragment>
  )
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/moneyBook' component={MoneyBook} />
      <Route path='/jyankenGame' component={JyankenGame} />
      <Route path='/weather' component={Weather} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)