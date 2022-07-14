
import React, { Component } from "react";
import "./index.css";
const classNames = require('classnames');

export default class FootballMatchesData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedYear: -1,
      fetchState: { status: 'loading', fail: { status: false, reason: null } },
      currentYearMatches: { count: 0, meta: [] }
    };
  }

  setFetchState = (state) => {
    return this.setState((prevState) => ({
      ...prevState,
      fetchState: {
        ...prevState.fetchState,
        ...state
      }
    }));
  };

  getApiUrlWithYear = (year) => {
    return `https://jsonmock.hackerrank.com/api/football_competitions?year=${year}`;
  };

  fetchMatchData = (year) => {
    return fetch(this.getApiUrlWithYear(year))
      .then((res) => res.json())
      .then(this.handleMatchData)
      .catch(this.handleFetchError);
  };

  handleMatchData = (match) => {
    this.setFetchState({ status: 'done' });

    return this.setState((prevState) => ({
      ...prevState,
      currentYearMatches: {
        ...prevState.currentYearMatches,
        count: match.total,
        meta: match.data
      }
    }));
  };

  handleFetchError = (error) => {
    return this.setFetchState({
      status: 'done',
      fail: {
        status: true,
        reason: error
      }
    });
  };

  onClick = (year) => (e) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedYear: year
    }));
    this.fetchMatchData(year);
  };

  render() {
    const years = [2011, 2012, 2013, 2014, 2015, 2016, 2017];
    return (
      <div className="layout-row">
        <div className="section-title">Select Year</div>
        <ul className="sidebar" data-testid="year-list">
          {years.map((year, i) => {
            return (
              <li className={
                classNames({
                  'sidebar-item': true,
                  'active': this.state.selectedYear === year
                })
              }
                onClick={this.onClick(year)}
                key={year}>
                <a>{year}</a>
              </li>
            )
          })}
        </ul>

        {this.state.selectedYear && (
          <section className="content">
            <LoadingAwareSection loading={this.state.fetchState.status}>
              {this.state.currentYearMatches.count === 0 ? (
                <div data-testid="no-result" className="slide-up-fade-in no-result">No Matches Found</div>
              ) : (
                  <section>
                    <div className="total-matches" data-testid="total-matches">
                      Total Matches: {this.state.currentYearMatches.count}
                    </div>
                    <ul className="mr-20 matches styled" data-testid="match-list">
                      {this.state.currentYearMatches.meta.map((match) => (
                        <li className="slide-up-fade-in" key={match.name}>
                          Match {match.name} won by {match.winner}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
            </LoadingAwareSection>
          </section>
        )}
      </div>
    );
  }
}

const LoadingAwareSection = ({ loading, children }) => {
  if (loading === 'loading') {
    return null;
  }
  return <section>{children}</section>;
}
