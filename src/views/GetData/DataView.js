import React, { Component, PropTypes } from 'react'
import { actions as manageData } from '../../redux/modules/Todos'
import { connect } from 'react-redux'
import classes from './DataView.scss'

const mapStateToProps = (state) => ({
  isFetching: state.todo.isFetching,
  isFetch: state.todo.isFetch,
  data: state.todo.myCollection
})

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
    return (
      <div className={classes.tempView}>
        <table>
          <thead>
            <th>Name</th>
            <th>Fullname</th>
            <th>more_column</th>
            <th>more_column2</th>
            <th>more_column3</th>
            <th>more_column4</th>
            <th>more_column5</th>
            <th>more_column6</th>
            <th>more_column7</th>
          </thead>
          <tbody>
          {this.props.isFetch ? this.props.data.result.map((item) =>
            <tr key={item.id}>
              <td><span className={item.id % 2 ? classes.even : classes.odd}>{item.test_data}</span></td>
              <td>{item.raw_data}</td>
              <td>{item.more_column}</td>
              <td>{item.more_column2}</td>
              <td>{item.more_column3}</td>
              <td>{item.more_column4}</td>
              <td>{item.more_column5}</td>
              <td>{item.more_column6}</td>
              <td>{item.more_column7}</td>
            </tr>
            ) : <tr><td>test</td></tr>}
          </tbody>
        </table>
      }</div>
    )
  }
}

export default connect(mapStateToProps, manageData)(DataView)
