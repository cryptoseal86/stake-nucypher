import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import { Navbar, Nav, Button, DropdownButton, Dropdown, Container, Tabs, Tab } from 'react-bootstrap';
import Web3Initilizer from './web3Initializer';
import StakerDashboard from './dashboards/StakerDashboard/StakerDashboard';
import WithdrawDashboard from './dashboards/WithdrawDashboard/WithdrawDashboard';
import HistoryDashboard from './dashboards/HistoryDashboard/HistoryDashboard';
import WorkLockDashboard from './dashboards/WorkLockDashboard/WorkLockDashboard';
import './App.scss';
import {StoreProvider} from './stores';
import { FaGithub } from 'react-icons/fa';

class App extends PureComponent {
  state = {
    key: 'stake'
  };

  handleSelectTab(key) {
    this.setState({ key });
  }

  render() {
    return <>
      <StoreProvider>
        <Router>
          <Navbar expand="lg">
            <Navbar.Brand href="#" className="mr-auto">
              <div className="logo">
              </div>
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/">Staking</Nav.Link>
              <Nav.Link href="/worklock">Worklock</Nav.Link>
            </Nav>
            <div className="float-right h4 m-5">
              <a href="https://github.com/cryptoseal86/stake-nucypher" target="_blank">
                <FaGithub></FaGithub>
              </a>
            </div>
          </Navbar>
          <div className="App">
            <Switch>
              <Route exact path="/">
                <div className="staker-container">
                  <Container>
                    <Tabs defaultActiveKey="stake" activeKey={this.state.key} className="tab-controls d-flex mx-auto" onSelect={this.handleSelectTab.bind(this)}>
                      <Tab eventKey="stake" title="Stake">
                        <StakerDashboard onTabChange={this.handleSelectTab.bind(this)}></StakerDashboard>
                      </Tab>
                      <Tab eventKey="withdraw" title="Withdraw">
                        <WithdrawDashboard></WithdrawDashboard>
                      </Tab>
                      <Tab eventKey="history" title="History">
                        <HistoryDashboard></HistoryDashboard>
                      </Tab>
                    </Tabs>
                  </Container>
                </div>
              </Route>
              <Route path="/worklock">
                <div className="staker-container">
                  <Container>
                    <WorkLockDashboard></WorkLockDashboard>
                  </Container>
                </div>
              </Route>
            </Switch>
          </div>
        </Router>
      </StoreProvider>
    </>;
  }
}

export default App;
