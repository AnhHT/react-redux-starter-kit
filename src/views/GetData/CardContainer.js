import React, {Component, PropTypes} from 'react'
import update from 'react/lib/update'
import Card from './Card'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

@DragDropContext(HTML5Backend)
export default class CardContainer extends Component {
  static propTypes = {
    data: PropTypes.object,
    gHeader: PropTypes.func,
    headers: PropTypes.object,
    isFetch: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.moveCard = this.moveCard.bind(this)
    this.onSelectHeaderIdx = this.onSelectHeaderIdx.bind(this)
    this.state = {
      cards: [],
      headerIndex: -1
    }
  }

  componentWillMount () {
    this.props.gHeader()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isFetch) {
      console.log(nextProps)
      this.setState({cards: [...nextProps.headers.layout.Columns]}, () => {
        let temp = this.props.data.result.Headers.length
        let cardsLength = this.state.cards.length
        let cards = this.state.cards
        if (cardsLength < temp) {
          for (let i = cardsLength; i < temp; i++) {
            cards = [...cards, {value: '?????'}]
          }

          this.setState({cards: [...cards]})
        }
      })
    }
  }

  moveCard (dragIndex, hoverIndex) {
    const { cards } = this.state
    const dragCard = cards[dragIndex]
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }))
  }

  onSelectHeaderIdx (e) {
    console.log(e.target.value)
    this.setState({headerIndex: e.target.value}, () => {
      console.log(this.state)
    })
  }

  render () {
    const { cards } = this.state
    const rows = this.props.data ? this.props.data.result.Rows : new Map()
    const headers = this.props.data ? this.props.data.result.Headers : new Map()
    return (
      <table>
        <thead>
          <tr>
            <th width='70'></th>
          {cards.map((item, i) => <th><Card key={i} id={i} index={i} text={item.value} moveCard={this.moveCard}/></th>)}
          </tr>
          <tr>
            <th width='70'>Vị trí Header</th>
          {headers.map((item) => <th width='150'>{item}</th>)}
          </tr>
        </thead>
        <tbody>
        {rows.map((row, rowIdx) =>
          <tr>
            <td><input type='radio' name='headerIndex' onChange={this.onSelectHeaderIdx}
              value={rowIdx}/></td>
            {row.CellValues.map((cell) => <td>{cell}</td>)}
          </tr>
        )}
        </tbody>
      </table>
    )
  }
}
