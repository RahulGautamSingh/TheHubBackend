import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { SMContextProvider } from "./context";
import Feed from "./Feed";
import Login from "./Login";
import SignUp from "./Signup";

export default function App() {
  useEffect(()=>{
    document.title = "The Hub"
  },[])
  return (
    <SMContextProvider>
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/feed" component={Feed} />
          
      </Switch>
    </Router>
    </SMContextProvider>
  );
}
