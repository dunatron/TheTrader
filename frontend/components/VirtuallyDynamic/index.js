import React from "react"
import PropTypes from "prop-types"
import Immutable from "immutable"
import { AutoSizer, CellMeasurer, VirtualScroll } from "react-virtualized"

import IdCellSizeCache from "./IdCellSizeCache"

export default class VariableHeightList extends React.Component {
  static propTypes = {
    /**
     * The collection that the list will be based off of
     */
    baseCollection: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      PropTypes.instanceOf(Immutable.List),
    ]).isRequired,

    /*
     * The function used to map indexes to collection ids
     * the signature should be (baseCollection, index) -> unique collection item id
     */
    idLookupFunction: PropTypes.func.isRequired,

    /*
     * The index -> element function used to measure and render the list items
     */
    elementGenerator: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props)
    const { baseCollection, idLookupFunction } = props
    this.SizeCache = new IdCellSizeCache(baseCollection, idLookupFunction)
  }

  componentWillReceiveProps(nextProps) {
    // use strict equality checking (shallow compare) to determine whether the
    // cache needs a new index -> id map
    if (this.props.baseCollection !== nextProps.baseCollection) {
      this.SizeCache.updateCollection(nextProps.baseCollection)
    }
  }

  render() {
    const { elementGenerator, baseCollection } = this.props
    const elementCount = baseCollection.count()

    return (
      <AutoSizer>
        {({ height, width }) => (
          <CellMeasurer
            cellRenderer={({ rowIndex }) => elementGenerator(rowIndex)}
            cellSizeCache={this.SizeCache}
            columnCount={1}
            rowCount={elementCount}
            width={width}>
            {({ getRowHeight }) => (
              <VirtualScroll
                height={height}
                rowCount={elementCount}
                rowHeight={getRowHeight}
                rowRenderer={({ index }) => elementGenerator(index)}
                width={width}
              />
            )}
          </CellMeasurer>
        )}
      </AutoSizer>
    )
  }
}
