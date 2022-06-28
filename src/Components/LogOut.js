
import { useContext, useEffect } from 'react';
import { AppContext } from '../Components/Context'
import {useNavigate} from "react-router-dom";
import SocketIO from "socket.io-client";
import { deleteApiModels } from '../Models/ApiModels';
import { message } from 'antd';

const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] })

const LogOut=()=> {
  const navigate=useNavigate();
  const {loginEmail, setLoginEmail} = useContext(AppContext);

  const deleteUserApi = async() => {
    try{
        deleteApiModels("/user-login?email="+loginEmail.email)
        .then(result=>{
          if(result.statusCode === 200) {
            message.success('Kullanıcı silindi..')
            
          }else if(result.statusCode === 300){
              message.error("Bir Hata Oldu, çıkış Yapmayı Tekrar Deneyiniz...")
          }else{
            message.error('Bir Şeyler Ters Gitti, çıkış Yapmayı Tekrar Deneyiniz..')
        }
      });
    }catch(e){
        alert(e.message)
    }
}

  const setUserSignOut = async() => {
    socket.emit('logout',{
      email:loginEmail.email,
      name:loginEmail.name
    })
    socket.on('user', (data)=>{
      console.log(data)
    })
    localStorage.removeItem("email")
    localStorage.removeItem("name")
    localStorage.removeItem("token")
    navigate("/login")
    setLoginEmail({email:""})
    deleteUserApi()
  }

    return (
      <AppContext.Provider value={{loginEmail, setLoginEmail}}>
        
              <div className="log-out">
              <button onClick={setUserSignOut}>Çıkış</button>
              </div>
            
      </AppContext.Provider>
    );
  
}

export default LogOut;
