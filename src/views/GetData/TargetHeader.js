import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'

const headerTarget = {
  drop (props, monitor) {
    props.onDrop(monitor.getItem)
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class TargetHeader extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired
  }

  render () {
    const {text, connectDropTarget, isOver} = this.props
    return connectDropTarget(
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        <div>{text}</div>
      {isOver &&
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
          opacity: 0.5,
          backgroundColor: 'yellow'}} />
      }
      </div>
    )
  }
}

export default DropTarget('MappingHeader', headerTarget, collect)(TargetHeader)
