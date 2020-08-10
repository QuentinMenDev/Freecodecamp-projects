class Application extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", null,
    React.createElement(QuoteBox, null));

  }}


class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [],
      currentQuote: {} };


    this.fetchQuote = this.fetchQuote.bind(this);
  }

  componentDidMount() {
    fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json').
    then(response => response.json()).
    then(data => {
      console.log(data.quotes[0]);
      this.setState({ quotes: data.quotes, currentQuote: data.quotes[Math.floor(Math.random() * data.quotes.length)] });
    });


  }

  fetchQuote() {
    this.setState({
      currentQuote: this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)] });

  }

  render() {
    return React.createElement("div", { id: "quote-box", class: "quote-wrapper" },
    React.createElement("div", { class: "quote-block" },
    React.createElement("div", { id: "text" },
    React.createElement("h1", null,
    this.state.currentQuote.quote)),


    React.createElement("div", { id: "author" },
    React.createElement("h4", null,
    this.state.currentQuote.author,
    React.createElement("a", { class: "btn", href: "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" + encodeURIComponent('"' + this.state.currentQuote.quote + '" ' + this.state.currentQuote.author), target: "_blank", id: "tweet-quote" }, React.createElement("i", { class: "fa fa-twitter" })), React.createElement("br", null),
    React.createElement("button", { class: "btn action", onClick: this.fetchQuote, id: "new-quote" }, "New Quote")))));




  }}


ReactDOM.render(React.createElement(Application, null), document.getElementById('app'));