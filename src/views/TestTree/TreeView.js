import React, { Component, PropTypes } from 'react'
import { actions as manageData } from '../../redux/modules/Todos'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  isFetching: state.todo.isFetching,
  isFetch: state.todo.isFetch,
  data: state.todo.myCollection
})

class Row extends Component {
  static propTypes = {
    item: PropTypes.object,
    counter: PropTypes.number
  }

  render () {
    let item = this.props.item
    return (
      <tr>
        <td>{this.props.counter}</td>
        <td>{item.Name}</td>
        <td>{item.ShortName}</td>
        <td>{item.ParrentName}</td>
      </tr>
    )
  }
}

export default class TreeView extends Component {
  static propTypes = {
    data: PropTypes.object,
    isFetching: PropTypes.bool,
    isFetch: PropTypes.bool,
    getData: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      fileData: null
    }
  }

  componentDidMount () {
    this.props.getData()
  }

  handleSubmit (e) {
  }

  render () {
    let counter = 0
    const rows = this.props.isFetch ? this.props.data.filteredList.map((item) =>
      <Row item={item} key={item.ID} counter={counter++}/>) : <tr>loading...</tr>

    return (
      <div className='abc'>
        <table>
          <thead>
            <tr>
              <th>Stt</th>
              <th>Tên đơn vị</th>
              <th>Mã đơn vị</th>
              <th>Mã đơn vị cấp trên</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, manageData)(TreeView)
