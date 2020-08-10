// Accurate_Interval.js 
// Thanks Squeege! For the elegant answer provided to this question: 
// http://stackoverflow.com/questions/8173580/setinterval-timing-slowly-drifts-away-from-staying-accurate
// Github: https://gist.github.com/Squeegy/1d99b3cd81d610ac7351
// Slightly modified to accept 'normal' interval/timeout format (func, time). 

(function () {
  window.accurateInterval = function (fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function () {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function () {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel };

  };
}).call(this);
class TimerElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", null,
    React.createElement("div", { class: "title", id: this.props.titleID },
    this.props.title),

    React.createElement("button", {
      id: this.props.subID,
      onClick: this.props.onClick,
      value: "-" }, "-"),

    React.createElement("div", { id: this.props.lengthID },
    this.props.length),

    React.createElement("button", {
      id: this.props.addID,
      onClick: this.props.onClick,
      value: "+" }, "+"));


  }}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: 'stop',
      timerType: 'Session',
      timer: 1500,
      intervalID: '' };


    this.setBreak = this.setBreak.bind(this);
    this.setSession = this.setSession.bind(this);
    this.updateLength = this.updateLength.bind(this);
    this.timeCalc = this.timeCalc.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.minusTimer = this.minusTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.countdown = this.countdown.bind(this);
    this.reset = this.reset.bind(this);
  }

  setBreak(e) {
    this.updateLength('Break', e.target.value, this.state.breakLength, 'breakLength');
  }
  setSession(e) {
    this.updateLength('Session', e.target.value, this.state.sessionLength, 'sessionLength');
  }
  updateLength(type, value, length, changeState) {
    if (this.state.timerState === "play") {return;}

    if (this.state.timerType === type) {
      if (value === "+" && length != 60) {
        this.setState({
          [changeState]: length + 1,
          timer: (length + 1) * 60 });

      } else if (value === "-" && length != 1) {
        this.setState({
          [changeState]: length - 1,
          timer: (length - 1) * 60 });

      }
    } else {
      if (value === "+" && length != 60) {
        this.setState({
          [changeState]: length + 1 });

      } else if (value === "-" && length != 1) {
        this.setState({
          [changeState]: length - 1 });

      }
    }
  }
  timeCalc() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  }
  startCountdown() {
    this.setState({
      intervalID: accurateInterval(() => {
        this.minusTimer();
        this.phaseControl();
      }, 1000) });

  }
  minusTimer() {
    this.setState({
      timer: this.state.timer - 1 });

  }
  phaseControl() {
    if (this.state.timer === 0) {
      const sound = document.getElementById('beep');
      sound.currentTime = 0;
      sound.play();
    }
    if (this.state.timer < 0) {
      if (this.state.timerType === "Session") {
        this.state.intervalID && this.state.intervalID.cancel();
        this.startCountdown();
        this.switchTimer(this.state.breakLength, 'Break');
      } else {
        this.state.intervalID && this.state.intervalID.cancel();
        this.startCountdown();
        this.switchTimer(this.state.sessionLength, 'Session');
      }
    }
  }
  switchTimer(length, type) {
    this.setState({
      timer: length * 60,
      timerType: type });

  }
  countdown() {
    if (this.state.timerState === "stop") {
      this.setState({
        timerState: "play" });

      this.startCountdown();
    } else {
      this.setState({
        timerState: "stop" });

      this.state.intervalID && this.state.intervalID.cancel();
    }
  }
  reset() {
    this.state.intervalID && this.state.intervalID.cancel();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerState: 'stop',
      timerType: 'Session',
      timer: 1500,
      intervalID: '' });


    const sound = document.getElementById('beep');
    sound.currentTime = 0;
    sound.pause();
  }

  render() {
    return React.createElement("div", null,
    React.createElement("p", null, "Pomodoro Clock"),



    React.createElement(TimerElement, {
      title: "Break Length",
      titleID: "break-label",
      addID: "break-increment",
      subID: "break-decrement",
      length: this.state.breakLength,
      lengthID: "break-length",
      onClick: this.setBreak }),


    React.createElement(TimerElement, {
      title: "Session Length",
      titleID: "session-label",
      addID: "session-increment",
      subID: "session-decrement",
      length: this.state.sessionLength,
      lengthID: "session-length",
      onClick: this.setSession }),


    React.createElement("div", { id: "timer-label" },
    this.state.timerType),

    React.createElement("audio", { id: "beep", src: "http://soundbible.com/mp3/A-Tone-His_Self-1266414414.mp3" }),
    React.createElement("div", { id: "time-left" },
    this.timeCalc()),


    React.createElement("button", { id: "start_stop", onClick: this.countdown }, "Start/Stop"),


    React.createElement("button", { id: "reset", onClick: this.reset }, "Reset"));



  }}


ReactDOM.render(React.createElement(App, null), document.getElementById('app'));