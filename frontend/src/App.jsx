
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Card from './pages/Card';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect } from 'react';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch } from 'react-redux';
import CategoryShop from './pages/CategoryShop';


function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category())
   

},[])


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/shops' element={<Shops/>} />
      <Route path='/card' element={<Card/>} />
      <Route path='/shipping' element={<Shipping/>} />
      <Route path='/products?' element={<CategoryShop/>} />
      <Route path='/product/details/:slug' element={<Details/>} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
