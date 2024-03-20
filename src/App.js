import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import RegisterUser from "./Components/RegisterUser/RegisterUser";
import UserPost from "./Components/RegisterUser/UserPost";
import UserFeedback from "./Components/RegisterUser/UserFeedback";
import UserFeedbackPost from "./Components/RegisterUser/UserFeedbackPost";
import UserPostStatus from "./Components/RegisterUser/UserPostStatus";
import RegisterWorker from "./Components/RegisterWorker/RegisterWorker";
import SolvePost from "./Components/RegisterWorker/SolvePost";
import WorkPost from "./Components/RegisterWorker/WorkPost";
import LoginUser from "./Components/LoginUser/LoginUser";
import CreateComplaint from "./Components/CreateComplaint/CreateComplaint";
import NavbarwithoutWallet from "./Components/Navbar/NavbarwithoutWallet";
import NavbarusingWallet from "./Components/Navbar/NavbarusingWallet";
import Verify from "./Components/Admin/Verify";
import Dashboard from "./Components/Admin/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [state, setState] = useState({
    keypair: null,
    program: null,
    baseAccount: null,
  });
  const saveStateforUser = (state) => {
    console.log(state);
    setState(state);
  };

  const [state1, setState1] = useState({
    provider: null,
    program: null,
    baseAccount: null,
  });
  const saveStateforWallet = (state1) => {
    console.log(state1);
    setState1(state1);
  };
  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Navbar /> <Hero />{" "}
              </>
            }
          ></Route>
          <Route
            exact
            path="/register"
            element={
              <>
                <NavbarwithoutWallet saveStateforUser={saveStateforUser} />{" "}
                <RegisterUser state={state} />
              </>
            }
          ></Route>
          <Route
            exact
            path="/feedpost"
            element={
              <>
                <NavbarwithoutWallet saveStateforUser={saveStateforUser} />{" "}
                <UserFeedback state={state} />
              </>
            }
          ></Route>
          <Route path="feedbackpost">
            <Route
              path=":userId"
              element={
                <>
                  {" "}
                  <NavbarwithoutWallet
                    saveStateforUser={saveStateforUser}
                  />{" "}
                  <UserFeedbackPost state={state} />{" "}
                </>
              }
            />
          </Route>
          <Route
            exact
            path="/login"
            element={
              <>
                <NavbarwithoutWallet saveStateforUser={saveStateforUser} />{" "}
                <LoginUser state={state} />
              </>
            }
          ></Route>
          <Route
            exact
            path="/create"
            element={
              <>
                <NavbarwithoutWallet saveStateforUser={saveStateforUser} />{" "}
                <CreateComplaint state={state} />
              </>
            }
          ></Route>
          <Route
            exact
            path="/post"
            element={
              <>
                <NavbarwithoutWallet saveStateforUser={saveStateforUser} />{" "}
                <UserPost state={state} />
              </>
            }
          ></Route>
          <Route path="status">
            <Route
              path=":userId"
              element={
                <>
                  {" "}
                  <NavbarwithoutWallet saveStateforUser={saveStateforUser} />
                  <UserPostStatus state={state} />{" "}
                </>
              }
            />
          </Route>

          <Route
            exact
            path="/registerworker"
            element={
              <>
                <NavbarusingWallet saveStateforWallet={saveStateforWallet} />{" "}
                <RegisterWorker state1={state1} />
              </>
            }
          ></Route>
          <Route
            exact
            path="/worker"
            element={
              <>
                <NavbarusingWallet saveStateforWallet={saveStateforWallet} />{" "}
                <WorkPost state1={state1} />
              </>
            }
          ></Route>
          <Route path="solve">
            <Route
              path=":userId"
              element={
                <>
                  {" "}
                  <NavbarusingWallet saveStateforWallet={saveStateforWallet} />
                  <SolvePost state1={state1} />{" "}
                </>
              }
            />
          </Route>

          <Route
            exact
            path="/admin"
            element={
              <>
                <NavbarusingWallet saveStateforWallet={saveStateforWallet} />{" "}
                <Verify state1={state1} />
              </>
            }
          ></Route>
          <Route
            exact
            path="/dashboard"
            element={
              <>
                <NavbarusingWallet saveStateforWallet={saveStateforWallet} />{" "}
                <Dashboard state1={state1} />
              </>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
