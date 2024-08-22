import React from "react";

import "./square.css";

export default class Square extends React.Component<
  { position: string },
  { position: string; color: string }
> {
  constructor(props: { position: string }) {
    super(props);
    this.state = {
      position: props.position,
      color: getSquareColor(props.position),
    };
  }

  render(): React.ReactNode {
    let id = "board-square-" + this.state.position + "-" + this.state.color;
    let squareClass =
      this.state.color === "light" ? "lightSquare" : "darkSquare";
    let txtClr = this.state.color === "light" ? "black" : "white";
    return (
      <div id={id}>
        <span className="squareLabel" style={{ color: txtClr }}>
          {this.state.position}
        </span>
        <div className={squareClass + " boardSquare"}></div>
      </div>
    );
  }
}

export function getSquareColor(position: string) {
  let xPos = position[0];
  let yPos = parseInt(position[1]);
  let kind = "dark";
  if (
    ["a", "c", "e", "g"].findIndex((x) => x === xPos) !== -1 &&
    yPos % 2 === 0
  ) {
    kind = "light";
  } else if (
    ["b", "d", "f", "h"].findIndex((x) => x === xPos) !== -1 &&
    yPos % 2 === 1
  ) {
    kind = "light";
  }
  return kind;
}
