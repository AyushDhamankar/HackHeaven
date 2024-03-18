import {useState} from 'react';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import RegisterUser from './Components/RegisterUser/RegisterUser';
import LoginUser from './Components/LoginUser/LoginUser';
import CreateComplaint from './Components/CreateComplaint/CreateComplaint';
import NavbarwithoutWallet from './Components/Navbar/NavbarwithoutWallet';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';

function App() {
  const [state, setState] = useState({
    keypair: null,
    program: null,
    baseAccount: null,
  })
  const saveStateforUser = (state) => {
    console.log(state);
    setState(state);
  }

  const [state1, setState1] = useState({
    keypair: null,
    program: null,
    baseAccount: null,
  })
  const saveStateforWallet = (state) => {
    console.log(state);
    setState1(state);
  }
  return (
    <>
    <Router>
           <Routes>
                <Route exact path='/' element={<><Navbar /> < Hero /> </>}></Route>
                <Route exact path='/register' element={<><NavbarwithoutWallet saveStateforUser={saveStateforUser}/> < RegisterUser state={state}/></>}></Route>
                <Route exact path='/login' element={<><NavbarwithoutWallet saveStateforUser={saveStateforUser}/> < LoginUser state={state}/></>}></Route>
                <Route exact path='/create' element={<><NavbarwithoutWallet saveStateforUser={saveStateforUser}/> < CreateComplaint state={state}/></>}></Route>
          </Routes>
      </Router>
    </>
  );
}

export default App;