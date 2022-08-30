import SocketIO from "socket.io-client";
import { useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";
import { useLocalStorageState } from "./Components/utils";
import { AppContext } from "./Components/Context";
import Login from "./Components/Login";
import MessageDetail from "./Components/MessageDetail";
import ChatList from "./Components/ChatList";
import SignUp from "./Components/SignUp";
import "antd/dist/antd.css";
import AddContact from "./Components/AddContact";
import { getApiModels } from '../src/Models/ApiModels';
import PersonInfo from "./Components/PersonInfo";
import ContactInfo from "./Components/ContactInfo";
import Contacts from "./Components/Contacts";
// const app = require('express')();
// const http=require('http').Server(app);
// const io=require('socket.io')(http);
const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] ,
auth: (cb) => {
  cb({
    token: localStorage.getItem("email").split(",")[2].split('"')[3]
  });
}
})

const App = () => {
  const [loginEmail, setLoginEmail] = useLocalStorageState("email", "");
  const [activeUser, setActiveUser]=useState([]);
  const [activeUsers, setActiveUsers]=useState([]);

  const getActiveUser = async() => {
    try{
        const res = await getApiModels("/user-login");

        if(res.status) {
          setActiveUser(res.data.filter(dataFilter => dataFilter.Email === loginEmail.email))
          setActiveUsers(res.data)
        }
    }catch(e){
        alert(e.message)
    }
  }


  useEffect(()=>{
    window.scrollTo(0, 0 - document.body.scrollHeight);
    socket.on('token_verify_socket', (data)=>{
      data.status? (
        console.log("token aktif")
      ):(
        console.log("token pasif")
      )
    })
    socket.on('disconnect_socket', (data) => {
      socket.emit('disconnect_user', {Email: loginEmail.email});
      //alert("disconnect ", data)
    })
    //io.on('connection', (socket)=>{
    //   socket.on('disconnect', function () {
    //     alert('socket disconnected ')
    //   })
    // })
    // //window.BeforeUnloadEvent = alert("kapanıyor")
      
    // http.listen(3001, ()=>{
    //   console.log(`server is running port: http://localhost:${3001}`); 
    // })
    getActiveUser()

  },[])

  useEffect(()=>{
    // activeUser.length === 0 ? logOut() : (<></>)
  },[activeUser])

  return (
    <AppContext.Provider value={{ loginEmail, setLoginEmail }}>
    {console.log(activeUser.length)}
      <div className="app">
        {/* {console.log(activeUser[0].Token)} */}
        <Routes>
          {(loginEmail === "") ? (
            <>
              <Route path="*" element={<Login  />} />
              <Route path="/signup" element={<SignUp />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ChatList />} />
              <Route path="/client" element={<ChatList />} />
              <Route path="/chatlist" element={<ChatList />} />
              <Route path="/message-detail/:id" element={<MessageDetail activeUsers={activeUsers ? activeUsers : null} token={activeUser.length && activeUser[0].Token ? activeUser[0].Token : null}/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/add-contact" element={<AddContact />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/person-info" element={<PersonInfo />} />
              <Route path="/person-info/:id" element={<ContactInfo />} />
            </>
          )}
        </Routes>
      </div>
    </AppContext.Provider>
  );
};

export default App;

//zamanlayıcı
//setTimeout(() =>{
//},1000)