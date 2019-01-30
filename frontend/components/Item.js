import React, { Component } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import ItemStyles from "./styles/item/ItemStyles"
import PriceTag from "./styles/PriceTag"
import Title from "./styles/item/Title"
import formatMoney from "../lib/formatMoney"

class Item extends Component {
  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }).isRequired,
  }

  render() {
    const { item } = this.props
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}

        <Title>
          <Link href={{ pathname: "./item", query: { id: item.id } }}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>

        <div className="buttonList">
          <Link
            href={{
              pathname: "update",
              query: { id: item.id },
            }}>
            <a>Edit ✏️</a>
          </Link>
          <div>Add</div>
          <div>Delete</div>
        </div>
      </ItemStyles>
    )
  }
}

export default Item
