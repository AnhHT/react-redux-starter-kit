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
    data: PropTypes.object
  }

  render () {
    const item = this.props.data
    return (
      <tr key={item.id}>
        <td>
          <span className={item.id % 2 ? classes.even : classes.odd}>{item.test_data}</span>
        </td>
        <td>{item.raw_data}</td>
        <td>{item.more_column}</td>
        <td>{item.more_column2}</td>
        <td>{item.more_column3}</td>
        <td>{item.more_column4}</td>
        <td>{item.more_column5}</td>
        <td>{item.more_column6}</td>
        <td>{item.more_column7}</td>
      </tr>
    )
  }
}

export default class DataView extends Component {
  static propTypes = {
    data: PropTypes.object,
    isFetching: PropTypes.bool,
    isFetch: PropTypes.bool,
    getData: PropTypes.func,
    uploadFile: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      fileData: null
    }
  }

  componentWillMount () {
    // this.props.getData()
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.uploadFile(this.state.fileData)
  }

  handleFile (e) {
    let formData = new FormData()
    let file = e.target.files[0]
    formData.append('rawFile', file)
    this.setState({fileData: formData})
  }

  render () {
    const rowData = this.props.isFetch ? this.props.data.result.map((rowItem) => <Rows data={rowItem}/>)
    : <tr><td colSpan='8'>loading...</td></tr>

    return (
      <div className={classes.tempView}>
        <div>
          <form encType='multipart/form-data'>
            <input type='file' onChange={::this.handleFile} />
            <button type='button' onClick={::this.handleSubmit}>Upload</button>
          </form>
        </div>
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
          <tbody>{rowData}</tbody>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, manageData)(DataView)
