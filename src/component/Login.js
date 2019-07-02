import React, {Component} from 'react';
import {Col, Container, Row, Button} from "reactstrap";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      ads: [],
      isLoading: false,
      optionsErr: [],
      lstErr: []
    }
  }

  onChangeText = (event) => {
    console.log(`event`, event.target.value)
  }

  onClickLogin = (event) => {
    console.log(`event`, event.target.value)
  }


  render() {
    return (
      <div className="App">
        <div className="back-ground">
          <Container>
            <Row><Col xs={6}>
              <Row><h2>Login Page</h2></Row>
              <Row>
                <Button className="w-100" onClick={this.onClickLogin}> Login</Button>
              </Row>
            </Col></Row>
          </Container>

        </div>
      </div>
    );
  }
}

export default Login;


