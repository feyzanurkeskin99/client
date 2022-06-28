import SocketIO from "socket.io-client";
import React,{useEffect, useState, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import { AppContext } from './Context'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { updateApiModels } from '../Models/ApiModels';
import { message, Input} from 'antd'
import InlineSVG from 'svg-inline-react';
import { HeaderIcons } from "../icon";


const PersonInfo  =()=>{
    const navigate = useNavigate();
    const {loginEmail, setLoginEmail}=useContext(AppContext);
    
    const [inputEmail, setInputEmail]=useState(loginEmail.email);
    const [inputName, setInputName]=useState(loginEmail.name);
    const [inputPassword, setInputPassword]=useState(loginEmail.password);
    const [status, setStatus]=useState(false);
    

    const updatePerson = async() => {
      // setSending(true)
      // form.submit();
    const obj={};
    try{
        if(inputName === '' || inputEmail === '' || inputPassword === ''){
            message.error('Kayıt yapılamadı, zorunlu alanları doldurunuz..')
        }else{
          obj.Name= inputName;
          obj.Email= inputEmail;
          obj.Password= inputPassword;
          await updateApiModels("/user-signup?email="+loginEmail.email,{Update:obj})  
          .then(result=>{
                if(result.status === true) {
                  message.success('Kişi Bilgileri Başarıyla Güncellendi..')
                  setLoginEmail({email:inputEmail, name:inputName, token:loginEmail.token, password:inputPassword})
                  navigate('/')
                }else{
                  if(result.statusCode === 300){
                      message.error("Bir Hata Oldu, Tekrar Deneyiniz...")
                  }else if(result.statusCode ===313){
                      message.error("Bu Kullanıcı Zaten Kayıtlı...")
                  }
                  }
            });

            
        }
    }catch(e){
        message.error('Kayıt Yapılamadı.. '+e);
    }
      // setSending(false)
    }

    useEffect(()=>{
      // Execute a function when the user releases a key on the keyboard
    const inputs=document.querySelectorAll(".updatePersonInput")
    const inputsArray = [...inputs];
    inputsArray.map((element)=>{
        element.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.which === 13 && !event.shiftKey) {
              // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a clicks
                document.getElementById("updatePerson").click();
            }
        })
    });
  },[])
      
        return(
            <div className='form-container'>
                <div className="form-header"><InlineSVG src={HeaderIcons.prev} onClick={()=> navigate('/')}></InlineSVG>
</div>
                <div className="form">
                    <div className="form-icon"><Avatar className="person-info" onClick={()=> navigate("/person-info")} size={50} icon={<UserOutlined />} /></div>
                    <h2>{loginEmail.name}</h2>
                    <div className="form-element"> 
                      <h2>Kişi Adı</h2>                     
                      <input className="updatePersonInput" type="text" value={inputName} onChange={(event) => setInputName(event.target.value)}/>

                    </div>
                    <div className="form-element"> 
                      <h2>Kişi Emaili</h2> 
                      <input className="updatePersonInput" type="text" value={loginEmail.email} disabled onChange={(event) => setInputEmail(event.target.value)}/>

                    </div>
                    <div className="form-element"> 
                    <h2>Kişi Şifresi</h2> 
                    <Input.Password value={inputPassword} onChange={(event) => setInputPassword(event.target.value)}/>
                    </div>
                    <button id="updatePerson" onClick={updatePerson}>GÜNCELLE</button>                    

                    </div>

                </div>            
        )
    
}

export default PersonInfo;