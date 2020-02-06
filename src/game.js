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

// to have a square with value and onClick function when clicked on it
function Square(props) {
  const className = "square" + (props.highlightWinner ? "highlight" : "");
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//Board() function is called when this whole pages load every time
function Board() {
  let isSymbolChosen = false; // firstly the player hs not chosen the symbol
  let Winningstatus = ""; // it will store what to display according to winning situation
  const [boardSquares, setBoardSquares] = useState(Array(9).fill(null)); // array of size 9 to store all the value of the 9 boxes
  const [win, setWinner] = useState(null); // to set who won 'X' or 'O'
  const squares = [...boardSquares]; // to have copy of boardsquares, to maipulate it and set it.
  const isFirstRun = useRef(true); //firstreference made false
  const winRef = useRef(win); // current ref of win state
  const [computerTurn, setComputerTurn] = useState(0); // to set the computer turn after the player has put X in box
  const [ResposeIndex, setData] = useState({}); // to store api response
  const [playerInput, setPlayerInput] = useState(""); // to store the symbol what player choose after opening the site
  const [highlightWinner, sethighlightWinner] = useState(Array(3).fill(null)); // to store the winning boxes to highlight it

  if (playerInput !== "") {
    isSymbolChosen = true; // when player choose any symbol this state should become true
  }

  useEffect(() => {
    const winningLines = [
      // the lines through which winner is decided
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      //if in index a, b, c values are same one player win
      if (
        boardSquares[a] &&
        boardSquares[a] === boardSquares[b] &&
        boardSquares[b] === boardSquares[c]
      ) {
        setWinner(boardSquares[a]); //setting wiiner in win
        winRef.current = boardSquares[a];
        //console.log("222", win);
        sethighlightWinner(winningLines[i]); //the winner lines to be set in highlightWinner.
      }
    }
  }, [boardSquares]);

  useEffect(() => {
    if (isFirstRun.current || winRef.current !== null) {
      // for the first time it should not render
      isFirstRun.current = false;
      return;
    } else {
      console.log("boardSquares:", boardSquares);
      fetch("https://koa-ttt.herokuapp.com/", {
        method: "POST", // for getting the response of post API call.
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(boardSquares) // passing the boardsquare with the existing values in the board
      })
        .then(res => res.json())
        .then(response => {
          setData(response); // setting the data in responseIndex.
        })
        .catch(error => console.log(error));
    }
  }, [computerTurn]);

  useEffect(() => {
    squares[ResposeIndex] = playerInput === "X" ? "O" : "X"; // to check what player chose so to print another symbol on responseindex
    setBoardSquares(squares);
  }, [ResposeIndex]);

  const handleClick = async index => {
    if (squares[index] || win) return; // if square is already have value or won then do nothing and return.
    squares[index] = playerInput; // set the playerinput at specified index
    setBoardSquares(squares);
    setComputerTurn(computerTurn + 1); // to set computerturn and do all the task in useEffect then
  };

  const renderSquare = index => {
    // it will call the square function passing values, onclick and highlightwinner.
    return (
      <Square
        value={boardSquares[index]}
        onClick={() => handleClick(index)} // call handleClick function with the index on which square it is clicked
        highlightWinner={highlightWinner && highlightWinner.includes(index)}
      />
    );
  };

  if (win === null && !boardSquares.includes(null)) {
    Winningstatus = `It's draw`;
  }
  if (win) {
    Winningstatus = `Winner is ${win}`;
  }

  if (!isSymbolChosen) {
    // if condition: if player has not chosen the symbol it will choose first
    return (
      <div className="status">
        Choose Your Symbol:
        <button className="symbol" onClick={() => setPlayerInput("X")}>
          X
        </button>
        <button className="symbol" onClick={() => setPlayerInput("O")}>
          O
        </button>
      </div>
    );
  } // then in else if it is chosen it will display the tic tac toe game.
  else {
    return (
      // all the squares will be displayed by calling rendersquare function with the index as parameter.
      <div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <div className="status">{Winningstatus}</div>
      </div>
    );
  }
}
