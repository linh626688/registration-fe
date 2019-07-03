import React, {Component} from 'react';
import {Col, Container, Row} from "reactstrap";

class Login extends Component {
  constructor() {
    super();
    this.state = {}
  }
  render() {
    return (
      <div>
        <div className="back-ground">
          <Container>
            <Row><Col xs={6}>
              <Row><h2>Login Page</h2></Row>
            </Col></Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Login;


