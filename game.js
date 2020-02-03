import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

function Game() {
  return (
    <div>
      <Board />
    </div>
  );
}
export default Game;

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//function onSubmit() {}

function Board() {
  const [boardSquares, setBoardSquares] = useState(Array(9).fill(null));

  // const [xIsNext, setXIsNext] = useState(true);
  const isInitialMount = useRef(true);
  const [computerInput, setData] = useState({});

  async function fetchData() {
    const res = await fetch("https://koa-ttt.herokuapp.com/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        // [null, null, null,null, null, null, null, null, null]
        boardSquares
      )
    });

    const data = await res.json();
    console.log(data);
    setData(data);
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchData();
    }
  });
  // useEffect(() => {
  //   fetchData();
  //   console.log("jjjjjjjjjjjjjjjjjjjjj");
  // }, []);

  // let status = 0;
  // status = `${computerInput}`;

  const handleClick = async index => {
    //copy array
    const squares = [...boardSquares];

    //check if square is already filled or not
    if (squares[index]) return;

    //what to be input X or O
    squares[index] = "X";

    // assigning modified squares to the setBoardSquares
    setBoardSquares(squares);
    console.log("Initial " + squares);
    // setting value of x as true or false for the next player to input another input acc.
    // setXIsNext(!xIsNext);
    //await fetchData();

    squares[computerInput] = "O";
    setBoardSquares(squares);
    console.log("Final " + squares);
  };

  // create render square function
  const renderSquare = index => {
    return (
      <Square value={boardSquares[index]} onClick={() => handleClick(index)} />
    );
  };

  // create our board
  return (
    <div>
      <div>
        <button className="symbol" value="X" onClick={this.value}>
          X
        </button>
        <button className="symbol" value="O" onClick={this.value}>
          O
        </button>
      </div>
      {boardSquares}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}
