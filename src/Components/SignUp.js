import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setApiModels } from '../Models/ApiModels';
import { message} from 'antd'
import {useLocalStorageState} from './utils'
import { AppContext } from './Context'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';


const SignUp =()=> {
    const navigate = useNavigate()
    const [loginEmail, setLoginEmail] = useLocalStorageState("email", ""); 
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');



    const setUserSignUp = async() => {
      // setSending(true)
      // form.submit();
    const obj={};
    try{
        if(name === '' || email === '' || password === ''){
            message.error('Kayıt yapılamadı, zorunlu alanları doldurunuz..')
        }else{
            obj.Name= name;
            obj.Password= password;
            obj.Email= email;
            await setApiModels("/user-signup",{SignUp:obj})
            .then(result=>{
                if(result.status === true) {
                    message.success('Kayıt Başarıyla Gönderildi..')
                    navigate('/login')
                }else{
                    if (result.statusCode === 312) {
                        console.log('Kullanıcı kayıtlı')
                        message.error('Kullanıcı Zaten Kayıtlı..')

                    }
                    message.error('Kayıt Gönderilemedi, Girdiğiniz Bilgileri Kontrol Ediniz..')
                }
            });
        }
    }catch(e){
        message.error('Mesajınız Gönderilemedi..');
    }
      // setSending(false)
    }

    
    useEffect(()=>{
          // Execute a function when the user releases a key on the keyboard
        const inputs=document.querySelectorAll(".signUpInput")
        const inputsArray = [...inputs];
        inputsArray.map((element)=>{
            element.addEventListener("keyup", function(event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.which === 13 && !event.shiftKey) {
                  // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a clicks
                    document.getElementById("signUp").click();
                }
            })
        });
    },[])


    return (
        <AppContext.Provider value={{loginEmail, setLoginEmail}}>
            <div className='form-container'>
                    <div className="form">
                        <div className="form-icon"><Avatar size={50} icon={<UserOutlined />} /></div>
                        <h2>KAYIT</h2>
                        <div className="form-element"> 
                            <h2>Adınız</h2>                     
                            <input className='signUpInput' type="text" onChange={(event) => setName(event.target.value)}/>
                        </div>
                        <div className="form-element"> 
                            <h2>Emailiniz</h2> 
                            <input className='signUpInput' type="text" onChange={(event) => setEmail(event.target.value)}/>
                        </div>
                        <div className="form-element"> 
                            <h2>Şifreniz</h2> 
                            <input className='signUpInput' type="password" onChange={(event) => setPassword(event.target.value)}/>
                        </div>

                        <button id='signUp' onClick={setUserSignUp}>KAYIT OL</button>
                        <div className="form-button">Bir hesabınız var mı? <h5 onClick={()=> navigate('/login')}>GİRİŞ YAP</h5></div>

                    </div>            
                </div>

                
        </AppContext.Provider>
    );
  
}

export default SignUp;
