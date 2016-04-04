import React, {Component, PropTypes} from 'react'
import {actions as manageData} from '../../redux/modules/Todos'
import {connect} from 'react-redux'
import classes from './DataView.scss'

const mapStateToProps = (state) => ({
  isUploading: state.todo.isUploading,
  isUploaded: state.todo.isUploaded,
  isFetching: state.todo.isFetching,
  isFetch: state.todo.isFetch,
  isFetchHeader: state.todo.isFetchHeader,
  isFetchingHeader: state.todo.isFetchingHeader,
  mappingHeader: state.todo.mappingHeader,
  data: state.todo.myCollection
})

class MyTable extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  render () {
    const headers = this.props.data ? this.props.data.Headers : new Map()
    const rows = this.props.data ? this.props.data.Rows : new Map()
    return (
      <table>
        <thead>
          <tr>
          {headers.map((item) => <th>{item.toUpperCase()}</th>)}
          </tr>
        </thead>
        <tbody>
        {rows.map((row) =>
          <tr>
            {row.CellValues.map((cell) => <td>{cell}</td>)}
          </tr>
        )}
        </tbody>
      </table>
    )
  }
}

export default class DataView extends Component {
  static propTypes = {
    data: PropTypes.object,
    mappingHeader: PropTypes.object,
    isFetching: PropTypes.bool,
    isFetch: PropTypes.bool,
    isFetchingHeader: PropTypes.bool,
    isFetchHeader: PropTypes.bool,
    isUploading: PropTypes.bool,
    isUploaded: PropTypes.bool,
    uploadFile: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      fileData: null
    }
  }

  componentDidMount() {
    this.props.getMappingHeader()
    this.props.getData()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.uploadFile(this.state.fileData)
  }

  handleFile(e) {
    let formData = new FormData()
    let file = e.target.files[0]
    formData.append('rawFile', file)
    this.setState({fileData: formData}, () => {
      console.log(this.state)
    })
  }

  render() {
    const data = this.props.isFetch ? <MyTable data={this.props.data.result}/> : <div>loading...</div>
    const mappingHeader = this.props.isFetchHeader ? this.props.mappingHeader.result.Columns.map((item) =>
      <span>{item}</span>
    ) : <div>loading...</div>
    return (
      <div className={classes.tempView}>
        <div>
          <form encType='multipart/form-data'>
            <input type='file' onChange={::this.handleFile}/>
            <button type='button' onClick={::this.handleSubmit}>Upload</button>
          </form>
        </div>
        <div>
          {mappingHeader}
        </div>
        <div>
          {data}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, manageData)(DataView)
