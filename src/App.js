import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Register from "./component/Register";
import Login from "./component/Login";

  function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Register} />
        <Route path="/register/" component={Register} />
        <Route path="/login/" component={Login} />
      </div>
    </Router>
  );
}

  export default App;


