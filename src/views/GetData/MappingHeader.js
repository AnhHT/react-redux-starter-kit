import React, { PropTypes } from 'react'
import { DragSource } from 'react-dnd'

const cardSource = {
  beginDrag (props) {
    return {
      text: props.text
    }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class MappingHeader extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
  }
  render () {
    const {isDragging, connectDragSource, text} = this.props
    return connectDragSource(
      <div style={{opacity: isDragging ? 0.5 : 1}}>
        {text}
      </div>
    )
  }
}

export default DragSource('MappingHeader', cardSource, collect)(MappingHeader)
