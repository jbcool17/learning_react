// +++++++++++++++++++++++++++++++++
//POS COMBINATIONS
// +++++++++++++++++++++++++++++++++

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};


// +++++++++++++++++++++++++++++++++
//STARS FRAME
// +++++++++++++++++++++++++++++++++

var StarsFrame = React.createClass({
  //setup and render
  render: function() {
    var stars = [];
    //add stars based random generated #of Stars var
    for (var i =0; i < this.props.numberOfStars; i++) {
      stars.push(
        <span className="glyphicon glyphicon-star"></span>
      );
    }

    //adds to frame
    return (
      <div id="stars-frame">
        <div className="well">
          {stars}
        </div>
      </div>
    );
  }
});

// +++++++++++++++++++++++++++++++++
//BUTTON FRAME
// +++++++++++++++++++++++++++++++++
var ButtonFrame = React.createClass({
  render: function() {
    var disabled, button, correct = this.props.correct;

    //checks for answer
    switch(correct) {
      case true:
      //setup button in success state - ready to accept answer
        button = (
          <button className="btn btn-success btn-lg"
                  onClick={this.props.acceptAnswer}>
            <span className="glyphicon glyphicon-ok"></span>
          </button>
        );
        break;
      case false:
        button = (
          //setup button in wrong state
          <button className="btn btn-danger btn-lg">
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        );
        break;
      default:
        //sets up button in normal state
        disabled = (this.props.selectedNumbers.length === 0);
        button = (
          <button className="btn btn-primary btn-lg" disabled={disabled}
                  onClick={this.props.checkAnswer}>
            =
          </button>
        );
    }

    return (
      <div id="button-frame">
        {button}
        <br /><br />

        //REDRAW button
        <button className="btn btn-warning btn-xs" onClick={this.props.redraw}
                disabled={this.props.redraws === 0}>
          <span className="glyphicon glyphicon-refresh"></span>
          &nbsp;
          {this.props.redraws}
        </button>
      </div>
    );
  }
});

// +++++++++++++++++++++++++++++++++
//ANSWER FRAME
// +++++++++++++++++++++++++++++++++

var AnswerFrame = React.createClass({
  render: function() {
    //gets props(properties from getInitialState)
    var props = this.props;

    //create new array of selected numbers, when called in GAME FRAME
    var selectedNumbers = props.selectedNumbers.map(function(i) {
      return (
        <span onClick={props.unselectNumber.bind(null, i)}>
          {i}
        </span>
      )
    });

    return (
      <div id="answer-frame">
        <div className="well">
          {selectedNumbers}
        </div>
      </div>
    );
  }
});

// +++++++++++++++++++++++++++++++++
//NUMBERS FRAME
// +++++++++++++++++++++++++++++++++
var NumbersFrame = React.createClass({
  render: function() {
    var numbers = [], className,
        selectNumber = this.props.selectNumber,
        usedNumbers = this.props.usedNumbers,
        selectedNumbers = this.props.selectedNumbers;

    //outputs 9 numbers to choose in FRAME, sets up with classes & and onClicks
    for (var i=1; i <= 9; i++) {
      className = "number selected-" + (selectedNumbers.indexOf(i)>=0);
      className += " used-" + (usedNumbers.indexOf(i)>=0);
      numbers.push(
        <div className={className} onClick={selectNumber.bind(null, i)}>
          {i}
        </div>
      );
    }
    return (
      <div id="numbers-frame">
        <div className="well">
          {numbers}
        </div>
      </div>
    );
  }
});

// +++++++++++++++++++++++++++++++++
//DONE FRAME - calls when finished - insert message
// +++++++++++++++++++++++++++++++++
var DoneFrame = React.createClass({
  render: function() {
    return (
      <div className="well text-center">
        <h2>{this.props.doneStatus}</h2>
        <button className="btn btn-default"
                onClick={this.props.resetGame}>
          Play again
        </button>
      </div>
    );
  }
});

// +++++++++++++++++++++++++++++++++
//GAME FRAME - holds all frames
// +++++++++++++++++++++++++++++++++
var Game = React.createClass({
  //sets initial state with Variables GAME FRAME will use
  getInitialState: function() {
    return { numberOfStars: this.randomNumber(),
             selectedNumbers: [],
             usedNumbers: [],
             redraws: 5,
             correct: null,
             doneStatus: null };
  },
  //reset the to above
  resetGame: function() {
    this.replaceState(this.getInitialState());
  },
  //sets random number for stars
  randomNumber: function() {
    return Math.floor(Math.random()*9) + 1
  },
  // select number
  selectNumber: function(clickedNumber) {

    if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
      this.setState(
        { selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
          correct: null }
      );
    }
  },
  unselectNumber: function(clickedNumber) {
    var selectedNumbers = this.state.selectedNumbers,
        indexOfNumber = selectedNumbers.indexOf(clickedNumber);

    selectedNumbers.splice(indexOfNumber, 1);

    this.setState({ selectedNumbers: selectedNumbers, correct: null });
  },
  //return sum of stars
  sumOfSelectedNumbers: function() {
    return this.state.selectedNumbers.reduce(function(p,n) {
      return p+n;
    }, 0)
  },
  //checks for answer
  checkAnswer: function() {
    var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers());
    this.setState({ correct: correct });
  },
  //accepts and resets
  acceptAnswer: function() {
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
    this.setState({
      selectedNumbers: [],
      usedNumbers: usedNumbers,
      correct: null,
      numberOfStars: this.randomNumber()
    }, function() {
      this.updateDoneStatus();
    });
  },
  //
  redraw: function() {
    if (this.state.redraws > 0) {
      this.setState({
        numberOfStars: this.randomNumber(),
        correct: null,
        selectedNumbers: [],
        redraws: this.state.redraws - 1
      }, function() {
        this.updateDoneStatus();
      });
    }
  },
  //checks possible solutions
  possibleSolution: function() {
    var numberOfStars = this.state.numberOfStars,
        possibleNumbers = [],
        usedNumbers = this.state.usedNumbers;

    for (var i=1; i<=9; i++) {
      if (usedNumbers.indexOf(i) < 0) {
        possibleNumbers.push(i);
      }
    }

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  },
  updateDoneStatus: function() {
    if (this.state.usedNumbers.length === 9) {
      this.setState({ doneStatus: 'Done. Nice!' });
      return;
    }
    if (this.state.redraws ===0 && !this.possibleSolution()) {
      this.setState({ doneStatus: 'Game Over!' });
    }
  },
  render: function() {
    var selectedNumbers = this.state.selectedNumbers,
        usedNumbers = this.state.usedNumbers,
        numberOfStars = this.state.numberOfStars,
        redraws = this.state.redraws,
        correct = this.state.correct,
        doneStatus = this.state.doneStatus,
        bottomFrame;

    if (doneStatus) {
      bottomFrame = <DoneFrame doneStatus={doneStatus}
                               resetGame={this.resetGame} />;
    } else {
      bottomFrame = <NumbersFrame selectedNumbers={selectedNumbers}
                      usedNumbers={usedNumbers}
                      selectNumber={this.selectNumber} />;
    }

    return (
      <div id="game">
        <h2>Play Nine</h2>
        <hr />
        <div className="clearfix">
          <StarsFrame numberOfStars={numberOfStars} />
          <ButtonFrame selectedNumbers={selectedNumbers}
                       correct={correct}
                       redraws={redraws}
                       checkAnswer={this.checkAnswer}
                       acceptAnswer={this.acceptAnswer}
                       redraw={this.redraw} />
          <AnswerFrame selectedNumbers={selectedNumbers}
                       unselectNumber={this.unselectNumber} />
        </div>

        {bottomFrame}

      </div>
    );
  }
});


// +++++++++++++++++++++++++++++++++
//RENDER TO DOM
// +++++++++++++++++++++++++++++++++
React.render(
  <Game />,
  document.getElementById('container')
);
