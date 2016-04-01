import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import MappingHeader from './MappingHeader'
import TargetHeader from './TargetHeader'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  onDropHandle (index, item) {
    this.setState({text: item})
  }

  render () {
    return (
      <div>
        <MappingHeader text='ABCXYZ'/>
        <MappingHeader text='CLGV'/>
        <MappingHeader text='WTF'/>
        <TargetHeader text='AS'/>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Header)
