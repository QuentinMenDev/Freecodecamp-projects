const keyNote = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Chord-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3' },
{
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Chord-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3' },
{
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Chord-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3' },
{
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Shaker',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3' },
{
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3' },
{
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3' },
{
  keyCode: 90,
  keyTrigger: 'Z',
  id: 'Punchy-Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3' },
{
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Side-Stick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3' },
{
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Snare',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3' }];


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: String.fromCharCode(160) };


    this.displayText = this.displayText.bind(this);
  }

  displayText(txt) {
    this.setState({
      display: txt });

  }

  render() {
    return React.createElement("div", { id: "drum-machine" },
    React.createElement(PadArea, { updateDisplay: this.displayText }),

    React.createElement("div", { id: "display" },
    this.state.display));


  }}


class PadArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let drumPad = keyNote.map((drumObj, i, drumArr) => {
      return (
        React.createElement(DrumPad, {
          padId: drumObj.id,
          url: drumObj.url,
          keyTrigger: drumObj.keyTrigger,
          keyCode: drumObj.keyCode,
          updateDisplay: this.props.updateDisplay }));


    });
    return React.createElement("div", { clasName: "padContainer" },
    drumPad);

  }}


class DrumPad extends React.Component {
  constructor(props) {
    super(props);

    this.playMusic = this.playMusic.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  handleKeyPress(e) {
    if (e.keyCode === this.props.keyCode) {
      this.playMusic();
    }
  }

  playMusic() {
    const sound = document.getElementById(this.props.keyTrigger);
    sound.currentTime = 0;
    sound.play();
    this.props.updateDisplay(this.props.padId.replace(/-/g, ' '));
  }

  render() {
    return React.createElement("div", { id: this.props.padId, onClick: this.playMusic, className: "drum-pad" },
    React.createElement("audio", { className: "clip", id: this.props.keyTrigger, src: this.props.url }),
    this.props.keyTrigger);

  }}


ReactDOM.render(React.createElement(App, null), document.getElementById('app'));