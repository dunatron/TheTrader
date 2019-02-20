import React, { PureComponent } from "react"

export default class SearchResult extends PureComponent {
  render() {
    const {
      style,
      data: {
        url,
        title,
        description,
        keywords,
        mainContent,
        secondaryContent,
      },
    } = this.props
    return (
      <div>
        <div
          style={{
            ...style,
            // maxHeight: 165,
            // overflow: "hidden",
            // borderBottom: "2px solid grey",
          }}>
          {/* <a href={this.props.data[index].url} target="_blank">
            {this.props.data[index].url}
          </a> */}
          <div dangerouslySetInnerHTML={{ __html: url }} />
          <div dangerouslySetInnerHTML={{ __html: title }} />
          <div
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: keywords,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: mainContent,
            }}
          />
          {/* <div
            dangerouslySetInnerHTML={{
              __html: secondaryContent,
            }}
          /> */}
        </div>
      </div>
    )
  }
}
