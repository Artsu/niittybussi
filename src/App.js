import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import convert from 'convert-seconds';
import leftPad from 'left-pad';
import Clock from 'react-live-clock';
import Rodal from 'rodal';
import windowSize from 'react-window-size';
import './App.css';

import 'rodal/lib/rodal.css';

function secondsSinceMidnight() {
  return Math.round((new Date()-new Date().setHours(0,0,0,0)) / 1000);
}

function formatTime(time) {
  return `${leftPad(time.hours, 2, '0')}:${leftPad(time.minutes, 2, '0')}` //:${leftPad(time.seconds, 2, '0')}
}

const BUS_ICON = (<svg id="icon-icon_bus" viewBox="0 0 1024 1024" width="100%" height="100%">
  <title>icon_bus</title>
  <path fill="rgb(255, 255, 255)" className="path1 fill-color14" d="M874.388 993.287h-716.811c-67.864 0-122.883-55.015-122.883-122.883v-716.811c0-67.864 55.015-122.883 122.883-122.883h716.811c67.864 0 122.883 55.015 122.883 122.883v716.811c0 67.868-55.018 122.883-122.883 122.883z" />
  <path fill="rgb(0, 122, 201)" className="path2 fill-color8" d="M0.033 126.799c0-69.114 57.594-126.709 126.709-126.709h767.931c71.676 0 129.27 57.594 129.27 126.709v767.931c0 71.672-57.594 129.27-129.27 129.27h-767.928c-69.114 0-126.709-57.594-126.709-129.27v-767.931zM513.268 110.16c-106.229 0-198.384 5.119-299.491 19.197-30.717 3.84-48.635 21.758-48.635 48.635v598.985c0 19.197 14.078 31.996 26.877 35.836l38.397 6.398v80.631c0 8.959 7.68 15.36 17.918 15.36h61.434c7.68 0 15.357-6.398 15.357-15.36v-71.672c49.914 6.398 117.75 8.959 185.585 8.959 69.114 0 139.508-2.558 188.146-8.959v71.672c0 8.959 8.959 15.36 16.636 15.36h61.434c10.238 0 17.918-6.398 17.918-15.36v-80.631l38.397-6.398c14.078-3.84 26.877-15.357 26.877-35.836v-598.982c0-26.877-17.918-44.795-48.635-48.635-102.393-12.799-195.823-19.2-298.216-19.2zM778.205 620.834c-72.951 12.799-168.946 25.598-262.376 25.598-98.553 0-191.983-11.517-266.216-28.156-20.476-3.84-28.156-11.52-28.156-28.156v-373.731c0-16.636 7.68-28.156 28.156-28.156l528.592 2.558c20.479 0 26.877 11.52 26.877 28.159v373.728c0 16.639-6.398 25.598-26.877 28.156zM241.933 723.227c1.279-16.636 16.636-31.996 34.557-31.996 17.918 0 33.275 15.357 33.275 31.996 0 19.197-15.357 34.557-33.275 34.557-19.197-1.279-34.557-16.639-34.557-34.557zM710.373 723.227c1.279-16.636 16.639-31.996 33.275-31.996 17.918 0 33.278 15.357 33.278 31.996 0 19.197-15.357 34.557-33.278 34.557-17.918-1.279-33.275-16.639-33.275-34.557z" />
</svg>)

const REAL_TIME_ICON = (<svg id="icon-icon_realtime" viewBox="0 0 1024 1024" width="100%" height="100%">
  <title>icon_realtime</title>
  <path className="path1" d="M368.356 1024.014c-44.781 0-81.079-36.302-81.079-81.079 0-361.528 294.123-655.658 655.651-655.658 44.781 0 81.079 36.302 81.079 81.079s-36.298 81.079-81.079 81.079c-272.112 0-493.497 221.385-493.497 493.5 0.004 44.773-36.295 81.079-81.075 81.079z" />
  <path className="path2" d="M81.072 1024.014c-44.781 0-81.079-36.302-81.079-81.079 0-519.948 423.002-942.946 942.939-942.946 44.781 0 81.079 36.302 81.079 81.079s-36.298 81.079-81.079 81.079c-430.524 0-780.781 350.257-780.781 780.788 0 44.773-36.298 81.079-81.079 81.079z" />
</svg>)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { modalVisible: false };
  }

  show() {
    this.setState({ modalVisible: true });
  }

  hide() {
    this.setState({ modalVisible: false });
  }

  componentDidMount() {
    setInterval(() => {
      this.props.data.refetch()
    }, 20 * 1000)
  }

  render() {
    if (this.props.data.stops) {
      const departures = this.props.data.stops[0].stoptimesWithoutPatterns;
      const departures2 = this.props.data.stops[1].stoptimesWithoutPatterns;
      return <div className="App">
        <div className="header">
          <span className="logo-icon">{BUS_ICON}</span>
          <h1>Niittybussi</h1>
          <div className="clock">
            <i className="fa fa-clock-o" aria-hidden="true" />
            <Clock format={'HH:mm:ss'} ticking={true} />
          </div>
        </div>
        <div className="content">
          <div>
            <h2>Kampin suuntaan</h2>
            {this.renderDepartures(departures)}
          </div>
          <div className="big-apple-container">
            <h2>Ison Omenan suuntaan</h2>
            {this.renderDepartures(departures2)}
          </div>
        </div>
        <button onClick={this.show.bind(this)} className="footer">Mikä niittybussi?</button>

        <Rodal width={this.props.windowWidth < 400 ? 300 : 400} height={400} visible={this.state.modalVisible} onClose={this.hide.bind(this)}>
          <div>
            <p>
              Niittybussi on harrasteena tehty projekti länsimetroa odotellessa.
            </p>
            <p>
              Data tulee suoraan HSL:n rajapinnoista ja se päivitetään automaattisesti 20 sekunnin välein. En ota mitään vastuuta datan oikeellisuudesta (tai pyöristysvirheistä :-)). Käyttö ja mahdolliset myöhästymiset omalla riskillä!
            </p>
            <p>
              Halutessasi voit ottaa yhteyttä sähköpostilla ari-matti@nivasalo.com
            </p>
            <p>
              Koodit löytyy <a href="https://github.com/artsu/niittybussi">GitHubista</a>
            </p>
          </div>
        </Rodal>
      </div>
    }
    return (
      <div>Loading...</div>
    );
  }

  renderDepartures(departures) {
    return (<div className="departures">
      <span className="grid-header header-times">Lähtö</span>
      <span className="grid-header">Nro</span>
      <span className="grid-header header-route">Määränpää</span>
      <span></span>
      {
        departures.map(departure => {
          const times = {
            time: convert(departure.scheduledDeparture),
            realTime: convert(departure.realtimeDeparture)
          }
          const time = formatTime(times.time, false);
          const realTime = formatTime(times.realTime, false);
          const timeToLeave = `${Math.round((departure.realtimeDeparture - secondsSinceMidnight())/60)} min`

          const showRealTime = departure.scheduledDeparture !== departure.realtimeDeparture
          return [
            <span key={`${departure.trip.route.longName}-${realTime}-time`}>{time}</span>,
            <span key={`${departure.trip.route.longName}-${realTime}-arrow`}>
              {showRealTime ? <i className="real-time-arrow fa fa-arrow-right" aria-hidden="true" /> : null}
            </span>,
            <span className="real-time" key={`${departure.trip.route.longName}-${realTime}-realTime`}>
              {showRealTime ? <span>
                <span className="real-time-icon">{REAL_TIME_ICON}</span>
                {realTime}
              </span> : null}
            </span>,
            <span className="route-number" key={`${departure.trip.route.longName}-${realTime}-number`}>
              {departure.trip.route.shortName}
            </span>,
            <span key={`${departure.trip.route.longName}-${realTime}-sign`}>{departure.headsign}</span>,
            <span className="time-left" key={`${departure.trip.route.longName}-${realTime}-timeLeft`}>
              {timeToLeave}
            </span>
          ]
        })
      }
    </div>)
  }
}

export default graphql(gql`
  query {
    stops(ids: ["HSL:2214238", "HSL:2214239"]) {
      gtfsId
      name
      stoptimesWithoutPatterns(numberOfDepartures:5){ 
        headsign,
        serviceDay,
        scheduledDeparture,
        realtimeDeparture,
        realtime,
        timepoint,
        trip{
          route{
            mode,
            shortName,
            longName
          }
        }
      }
    }
  }
`)(windowSize(App));
