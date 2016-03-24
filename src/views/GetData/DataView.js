import React, { Component, PropTypes } from 'react'
import { actions as manageData } from '../../redux/modules/Todos'
import { connect } from 'react-redux'
import classes from './DataView.scss'

const mapStateToProps = (state) => ({
  isFetching: state.todo.isFetching,
  isFetch: state.todo.isFetch,
  data: state.todo.myCollection
})

class Rows extends Component {
  static propTypes = {
    item: PropTypes.object
  }

  render () {
    return (
      <tr key={this.props.item.id}>
        <td>
          <span className={this.props.item.id % 2 ? classes.even : classes.odd}>{this.props.item.test_data}</span>
        </td>
        <td>{this.props.item.raw_data}</td>
        <td>{this.props.item.more_column}</td>
        <td>{this.props.item.more_column2}</td>
        <td>{this.props.item.more_column3}</td>
        <td>{this.props.item.more_column4}</td>
        <td>{this.props.item.more_column5}</td>
        <td>{this.props.item.more_column6}</td>
        <td>{this.props.item.more_column7}</td>
      </tr>
    )
  }
}

export class DataView extends Component {
  static propTypes = {
    data: PropTypes.object,
    isFetching: PropTypes.bool,
    isFetch: PropTypes.bool,
    getData: PropTypes.func
  };

  componentWillMount () {
    this.props.getData()
  }

  render () {
    const rowData = this.props.isFetch ? this.props.data.result.map((item) => <Rows item={item}/>)
    : <tr><td colSpan='8'>test</td></tr>

    return (
      <div className={classes.tempView}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Fullname</th>
              <th>more_column</th>
              <th>more_column2</th>
              <th>more_column3</th>
              <th>more_column4</th>
              <th>more_column5</th>
              <th>more_column6</th>
              <th>more_column7</th>
            </tr>
          </thead>
          <tbody>
          {rowData}
          {
            this.props.isFetch ? <tr><td colSpan='8'>{this.props.data.result.length}</td></tr>
             : <tr><td colSpan='8'>0</td></tr>
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, manageData)(DataView)
