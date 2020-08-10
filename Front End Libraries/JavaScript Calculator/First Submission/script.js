class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formula: [{ val: "0", type: 'init' }],
      prevVal: "0",
      display: "0",
      hasDecimal: false };


    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
  }

  handleReset() {
    this.setState({
      formula: [{ val: "0", type: 'init' }],
      prevVal: "0",
      display: "0",
      hasDecimal: false });

  }
  handleDel() {
    let transit = this.state.formula;
    if (transit.length === 1) {
      transit = [{ val: "0", type: 'init' }];
    } else {
      transit.pop();
    }

    this.setState({
      formula: transit });

  }
  handleNumbers(e) {
    let transit = this.state.formula;
    let display = this.state.display;

    if (!/^[0-9]/.test(display)) {
      display = "";
    }

    if (transit[0].type === "init" || transit[transit.length - 1].val === "0") {
      transit[0] = {
        val: e.target.value,
        type: "number" };

      display = e.target.value;
    } else {
      transit.push({
        val: e.target.value,
        type: "number" });

      display += e.target.value;
    }
    this.setState({
      formula: transit,
      display: display });

  }
  handleDecimal(e) {
    console.log('plop');
    let transit = this.state.formula;
    let display = this.state.display;
    let hasDecimal = this.state.hasDecimal;

    if (transit[0].type !== 'init') {
      if (!hasDecimal) {
        transit.push({
          val: e.target.value,
          type: "operator" });

        display += '.';
        hasDecimal = true;
      }
    } else {
      transit[0].type = 'number';
      transit.push({
        val: e.target.value,
        type: "operator" });

      display += '.';
      hasDecimal = true;
    }

    console.log(transit);

    this.setState({
      formula: transit,
      display: display,
      hasDecimal: hasDecimal });

  }
  handleOperators(e) {
    let transit = this.state.formula;
    let display = "";

    if (transit[0].type === "init") {
      if (e.target.value === "negative") {
        transit[0] = {
          val: "-",
          type: "operator" };

        display = "-";
      } else {
        transit[0] = {
          val: this.state.prevVal,
          type: "number" };


        if (e.target.value === "exp") {
          transit.push({
            val: "E",
            type: "operator" });


          display = "E";
        } else {
          transit.push({
            val: e.target.value,
            type: "operator" });

          display = e.target.value;
        }
      }
    } else {
      const formLength = this.state.formula.length;
      if (e.target.value === "negative" && this.state.formula[formLength - 1].val !== "-") {
        transit.push({
          val: "-",
          type: "operator" });

        display = '-';
      } else if (e.target.value === "exp") {
        if (this.state.formula[formLength - 1].type !== "operator") {
          transit.push({
            val: "E",
            type: "operator" });

        } else {
          transit[transit.length - 1] = {
            val: "E",
            type: "operator" };

        }

        display = 'E';
      } else {
        if (this.state.formula[formLength - 1].type !== "operator") {
          transit.push({
            val: e.target.value,
            type: "operator" });

        } else {
          if (e.target.value === '-') {
            transit.push({
              val: e.target.value,
              type: "operator" });

          } else {
            if (transit[transit.length - 1].val === "-" && transit[transit.length - 2].type === "operator") {
              transit.pop();
            }
            transit[transit.length - 1] = {
              val: e.target.value,
              type: "operator" };

          }
        }
        display = e.target.value;
      }
    }
    this.setState({
      formula: transit,
      display: display,
      hasDecimal: false });

  }

  handleResult() {
    let formula = this.state.formula.map(elem => {return elem.val;});
    let expression = formula.join("");
    while (/[x+‑/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
    let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
    console.log(answer);
    this.setState({
      formula: [{ val: "0", type: 'init' }],
      prevVal: answer.toString(),
      display: answer.toString() });

  }

  render() {
    return React.createElement("div", null,
    React.createElement(Display, { result: this.state.display, formula: this.state.formula }),

    React.createElement(Pad, { numbers: this.handleNumbers, operator: this.handleOperators, reset: this.handleReset, del: this.handleDel, equal: this.handleResult, decimal: this.handleDecimal }));

  }}


// Elements
class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let formula = this.props.formula.map(elem => {
      return elem.val;
    });
    return React.createElement("div", { class: "display-area", id: "display-area" },
    React.createElement("div", { class: "formula" },
    formula),

    React.createElement("div", { class: "display", id: "display" },
    this.props.result));


  }}


class Pad extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", { class: "pad" },
    React.createElement("button", { value: "7", onClick: this.props.numbers, id: "seven" }, "7"),
    React.createElement("button", { value: "8", onClick: this.props.numbers, id: "eight" }, "8"),
    React.createElement("button", { value: "9", onClick: this.props.numbers, id: "nine" }, "9"),
    React.createElement("button", { disabled: true, onClick: this.props.del, class: "del disabled", id: "del" }, "DEL"),
    React.createElement("button", { onClick: this.props.reset, class: "ac", id: "clear" }, "AC"),

    React.createElement("button", { value: "4", onClick: this.props.numbers, id: "four" }, "4"),
    React.createElement("button", { value: "5", onClick: this.props.numbers, id: "five" }, "5"),
    React.createElement("button", { value: "6", onClick: this.props.numbers, id: "six" }, "6"),
    React.createElement("button", { value: "x", onClick: this.props.operator, class: "operator", id: "multiply" }, "x"),
    React.createElement("button", { value: "/", onClick: this.props.operator, class: "operator", id: "divide" }, "/"),

    React.createElement("button", { value: "1", onClick: this.props.numbers, id: "one" }, "1"),
    React.createElement("button", { value: "2", onClick: this.props.numbers, id: "two" }, "2"),
    React.createElement("button", { value: "3", onClick: this.props.numbers, id: "three" }, "3"),
    React.createElement("button", { value: "+", onClick: this.props.operator, class: "operator", id: "add" }, "+"),
    React.createElement("button", { value: "-", onClick: this.props.operator, class: "operator", id: "subtract" }, "-"),

    React.createElement("button", { value: "0", onClick: this.props.numbers, id: "zero" }, "0"),
    React.createElement("button", { value: ".", onClick: this.props.decimal, id: "decimal" }, "."),
    React.createElement("button", { disabled: true, value: "negative", onClick: this.props.operator, class: "disabled", id: "negative" }, "(-)"),
    React.createElement("button", { disabled: true, value: "exp", onClick: this.props.operator, class: "operator disabled", id: "exponential" }, "exp"),
    React.createElement("button", { onClick: this.props.equal, class: "execute", id: "equals" }, "="));

  }}


ReactDOM.render(React.createElement(App, null), document.getElementById("app"));