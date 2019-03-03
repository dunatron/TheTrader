import React, { Component } from "react"

export default class EngineResult extends Component {
  render() {
    const { item } = this.props
    const {
      url,
      title,
      keywords,
      description,
      mainContent,
      secondaryContent,
    } = item
    return (
      <div>
        <div>url: {url}</div>
        <div>title: {title}</div>
        <div>keywords: {keywords}</div>
        <div>description: {description}</div>
        <div>mainContent: {mainContent}</div>
        <div>secondaryContent: {secondaryContent}</div>
        <hr />
      </div>
    )
  }
}
