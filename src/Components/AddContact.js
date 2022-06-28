import SocketIO from "socket.io-client";
import React,{useEffect, useState, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import { AppContext } from './Context'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setAddContactApiModels } from '../Models/ApiModels';
import { message} from 'antd'
import InlineSVG from 'svg-inline-react';
import { HeaderIcons } from "../icon";


const AddContact  =()=>{
    const navigate = useNavigate();
    const {loginEmail, setloginEmail}=useContext(AppContext);
    
    const [inputEmail, setInputEmail]=useState('');
    const [inputName, setInputName]=useState('');
    const [status, setStatus]=useState(false);
    

    const setAddContact = async() => {
      // setSending(true)
      // form.submit();
    const obj={};
    try{
        if(inputName === '' || inputEmail === ''){
            message.error('Kayıt yapılamadı, zorunlu alanları doldurunuz..')
        }else{
          obj.Name= inputName;
          obj.Email= inputEmail;
          obj.ToName= loginEmail.name;
          obj.ToEmail= loginEmail.email;
          // obj.Password= password;
          await setAddContactApiModels("/contacts",{Contacts:obj})  
          .then(result=>{
                if(result.status === true) {
                  message.success('Kişi Kayıtı Başarıyla Yapıldı..')
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
    const inputs=document.querySelectorAll(".addContactInput")
    const inputsArray = [...inputs];
    inputsArray.map((element)=>{
        element.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.which === 13 && !event.shiftKey) {
              // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a clicks
                document.getElementById("addContact").click();
            }
        })
    });
  },[])
      
        return(
            <div className='form-container'>
                <div className="form-header"><InlineSVG src={HeaderIcons.prev} onClick={()=> navigate('/')}></InlineSVG>
</div>
                <div className="form">
                    <div className="form-icon"> <InlineSVG src={HeaderIcons.addpersonbig}/> </div>
                    <h2>KİŞİ EKLE</h2>
                    <div className="form-element"> 
                      <h2>Kişi Adı</h2>                     
                      <input className="addContactInput" type="text" onChange={(event) => setInputName(event.target.value)}/>

                    </div>
                    <div className="form-element"> 
                      <h2>Kişi Emaili</h2> 
                      <input className="addContactInput" type="text" onChange={(event) => setInputEmail(event.target.value)}/>

                    </div>
                    {/* <input placeholder='Şifreniz' type="text" onChange={(event) => setInputPassword(event.target.value)}/> */}

                    <button id="addContact" onClick={setAddContact}>KİŞİ EKLE</button>                    
                </div>            
            </div>
        )
    
}

export default AddContact;