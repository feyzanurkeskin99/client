import SocketIO from "socket.io-client";
import React,{useEffect, useState, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import { AppContext } from './Context'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setLoginApiModels } from '../Models/ApiModels';
import { message, Input} from 'antd'

const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] })

const Login  =()=>{
    const navigate = useNavigate();
    const {loginEmail, setLoginEmail}=useContext(AppContext);
    
    const [inputEmail, setInputEmail]=useState('');
    const [inputName, setInputName]=useState('');
    const [inputPassword, setInputPassword]=useState('');
    const [status, setStatus]=useState(false);
    

    const setUserLogin = async() => {
      // setSending(true)
      // form.submit();
    const obj={};
    try{
        if(inputName === '' || inputEmail === ''|| inputPassword === ''){
            message.error('Giriş yapılamadı, zorunlu alanları doldurunuz..')
        }else{
          obj.Name= inputName;
          obj.Email= inputEmail;
          obj.Password= inputPassword;
          await setLoginApiModels("/user-login",{Login:obj})  
          .then(result=>{
                if(result.status === true) {
                  message.success('Giriş Başarıyla Yapıldı..')
                  socket.emit('login',{
                    email:inputEmail,
                    password:inputPassword,
                    name:inputName
                  })
                  socket.on('user', (data)=>{
                    console.log(data)
                  })
                  console.log(result)
                  setLoginEmail({email:inputEmail, name:inputName, token:result.data.Token, password:inputPassword})
                  navigate('/')
                }else{
                  if(result.statusCode === 300){
                      message.error("Bir Hata Oldu, Giriş Yapmayı Tekrar Deneyiniz...")
                  }else if(result.statusCode ===313){
                      message.error("Bu Kullanıcı Zaten Aktif...")
                  }else if(result.statusCode ===314){
                      message.error("Böyle Bir Kullanıcı Bulunmamakta, Kayıt Olup Tekrar Deneyin...")
                  }else if(result.statusCode ===315){
                    message.error('Şifrenizi Kontrol Ediniz..')
                  }else if(result.statusCode ===316){
                      message.error('Bir Şeyler Ters Gitti, Giriş Yapmayı Tekrar Deneyiniz..')
                  }

                  }
            });

            
        }
    }catch(e){
        message.error('Giriş Yapılamadı.. '+e);
    }
      // setSending(false)
    }

    useEffect(()=>{
      // Execute a function when the user releases a key on the keyboard
    const inputs=document.querySelectorAll(".signInInput")
    const inputsArray = [...inputs];
    inputsArray.map((element)=>{
        element.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.which === 13 && !event.shiftKey) {
              // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a clicks
                document.getElementById("signIn").click();
            }
        })
    });
  },[])
      
        return(
            <div className='form-container'>
                <div className="form">
                    <div className="form-icon"><Avatar size={50} icon={<UserOutlined />} /></div>
                    <h2>GİRİŞ</h2>
                    <div className="form-element"> 
                      <h2>Adınız</h2>                     
                      <input className="signInInput" type="text" onChange={(event) => setInputName(event.target.value)}/>

                    </div>
                    <div className="form-element"> 
                      <h2>Emailiniz</h2> 
                      <input className="signInInput" type="text" onChange={(event) => setInputEmail(event.target.value)}/>

                    </div>
                    {/* <input placeholder='Şifreniz' type="text" onChange={(event) => setInputPassword(event.target.value)}/> */}
                    <div className="form-element"> 
                      <h2>Şifreniz</h2> 
                      {/* <input type="password" onChange={(event) => setInputPassword(event.target.value)}/> */}
                      <Input.Password className="signInInput" onChange={(event) => setInputPassword(event.target.value)}/>
                    </div>
                    <button id="signIn" onClick={setUserLogin}>GİRİŞ YAP</button>
                    <div className="form-button">Bir hesabınız yok mu? <h5 onClick={()=> navigate('/signup')}>KAYIT OL</h5></div>
                    
                </div>            
            </div>
        )
    
}

export default Login;