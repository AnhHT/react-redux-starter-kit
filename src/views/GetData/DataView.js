import React, {Component, PropTypes} from 'react'
import CardContainer from './CardContainer'
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
    uploadFile: PropTypes.func,
    getMappingHeader: PropTypes.func,
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
    e.preventDefault()
    this.props.uploadFile(this.state.fileData)
  }

  handleFile (e) {
    let formData = new FormData()
    let file = e.target.files[0]
    formData.append('rawFile', file)
    this.setState({fileData: formData}, () => {
      console.log(this.state)
    })
  }

  render () {
    let key = 1
    const data = this.props.isFetch ? (<CardContainer key={key} data={this.props.data}
      gHeader={this.props.getMappingHeader} headers={this.props.mappingHeader}
      isFetch={this.props.isFetchHeader}/>) : <div>loading...</div>
    return (
      <div className={classes.tempView}>
        <div>
          <form encType='multipart/form-data'>
            <input type='file' onChange={::this.handleFile}/>
            <button type='button' onClick={::this.handleSubmit}>Upload</button>
          </form>
        </div>
        <div>
          {data}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, manageData)(DataView)
