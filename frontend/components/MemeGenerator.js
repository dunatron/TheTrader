import React, { Component } from "react"
import html2canvas from "html2canvas"
import DragDropUploader from "./DragDropUploader"
import encodeImage from "../lib/encodeImage"

export default class MemeGenerator extends Component {
  state = {
    topText: "",
    bottomText: "",
    imgFile: "",
    loading: false,
  }
  setFileInState = d =>
    this.setState({
      imgFile: d,
    })
  render() {
    const { topText, bottomText, imgFile, loading } = this.state

    return (
      <div>
        <div className="meme" id="memecontainer">
          <p id="top">{topText}</p>
          <p id="bottom">{bottomText}</p>
          <img src={imgFile} height="400" width="300" id="momo" alt="" />
        </div>

        <div className="controls" id="controls">
          <input
            type="text"
            id="url"
            name=""
            value={imgFile}
            onChange={() => alert("a change")}
            placeholder="URL de la imagen"
          />
          <input
            type="text"
            id="msgtop"
            name=""
            value={imgFile}
            onChange={() => alert("a change")}
            placeholder="Linea de Arriba"
          />
          {/* <input
            type="text"
            id="msgbtm"
            name=""
            value={imgFile}
            onChange={() => alert("a change")}
            placeholder="Linea de Abajo"
          /> */}
          {imgFile && this.renderImage(imgFile)}
          <DragDropUploader
            disabled={loading}
            multiple={false}
            types={["image"]}
            extensions={[".jpg", ".png"]}
            receiveFile={file => {
              console.log("received File => ", file)
              this.setFileInState(file)
            }}
          />
          <button
            type="button"
            id="generate"
            name="button"
            onClick={() => this._createMeme()}>
            Generar imagen
          </button>
        </div>
      </div>
    )
  }

  renderImage = file => {
    const src = "data:image/png;base64," + encodeImage(file.content)
    return (
      <img
        style={{ margin: 0, width: 300, display: "block" }}
        src={src}
        id="output"
        alt=""
      />
    )
  }

  _createMeme = () => {
    const { imgFile } = this.state
    // html2canvas(document.getElementById("memecontainer")).then(canvas => {
    //   console.log("here is canvas => ", canvas)
    //   // document.body.appendChild(canvas)
    // })
    // html2canvas(document.body).then(function(canvas) {
    //   document.body.appendChild(canvas)
    // })
    // html2canvas(document.getElementById("memecontainer")).then(function(
    //   canvas
    // ) {
    //   document.body.appendChild(canvas)
    // })
    // var canvas = document.getElementById("memecontainer")
    // var ctx = canvas.getContext("2d")

    var image = new Image()
    // image.onload = function() {
    //   ctx.drawImage(image, 0, 0)
    // }
    // image.src =
    //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oMCRUiMrIBQVkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADElEQVQI12NgoC4AAABQAAEiE+h1AAAAAElFTkSuQmCC"
    // image.src = "data:image/png;base64," + encodeImage(imgFile.content)
    image.src = "data:image/png;base64," + imgFile.content
    // document.body.appendChild(image)

    html2canvas(document.getElementById("memecontainer")).then(function(
      canvas
    ) {
      var img = document.createElement("img")
      img.setAttribute("download", "myImage.png")
      img.src = "data:image/png;base64," + encodeImage(imgFile.content)
      document.body.appendChild(img)
      // document.body.appendChild(canvas)
    })
  }
}
