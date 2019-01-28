import React, { Component } from "react"
import Nav from "./Nav"

const Header = () => (
  <div>
    <div className="bar">
      <a href="/">The_Trader</a>
      <Nav />
    </div>
    <div className="sub-bar">
      <p>Search</p>
    </div>
    <div>Cart</div>
  </div>
)

export default Header
