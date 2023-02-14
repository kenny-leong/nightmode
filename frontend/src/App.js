import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LoggedInLanding from "./components/GetAllSpots";
import SpotDetails from "./components/SpotDetails";
import CreateSpot from "./components/CreateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/' component={LoggedInLanding} />
          <Route path='/spots/new' component={CreateSpot} />
          <Route path='/spots/:spotId' component={SpotDetails} />
          <Route>
            <p>Page Not Found</p>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
