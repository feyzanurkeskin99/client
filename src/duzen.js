
import SocketIO from "socket.io-client";
import { useEffect, useState } from 'react';
import { setApiModels } from './Models/ApiModels';
import { message} from 'antd'

const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] })

function App() {

  const [text, setText]=useState('');
  const [name, setName]=useState('');
  const [phone, setPhone]=useState('');
  const [password, setPassword]=useState('');
  const [loginPhone, setLoginPhone]=useState(window.localStorage.getItem("phone") !== null ? (window.localStorage.getItem("phone")) : '');
  const [loginPassword, setLoginPassword]=useState('');
  const [datas, setDatas]=useState([]);
  // const [sending,setSending] = useState(false)

  useEffect(()=>{
    //message=> emit'e verdiğimiz isim
    socket.on('message', (data)=>{
      //console.log(data.text)
    });
  },[text])


  const sendData=()=>{
    if(text !== ''){
    socket.emit('dataMsg',{
      msg:text,
      phone:loginPhone
    })
    socket.on('message', (data)=>{
      datas.push(data)
      setDatas([...datas])
      console.log(datas)
      // setDataPhone(data.phone)
    })
    }else{
      alert('lütfen mesaj giriniz..')
    }
  }



  const setUserSignUp = async() => {
    // setSending(true)
    // form.submit();
    const obj={};
    try{
        if(name === '' || phone === '' || password === ''){
          message.error('Mesajınız Gönderilemedi, zorunlu alanları doldurunuz..')
        }else{
            obj.Name= name;
            obj.Password= password;
            obj.Phone= phone;
            
            await setApiModels("/user_login",{Login:obj})
            .then(result=>{
                
                if(result.status === true) {
                    message.success('Mesajınız Başarıyla Gönderildi..')
                }else{
                    message.error('Mesajınız Gönderilemedi, Girdiğiniz Bilgileri Kontrol Ediniz..')
                }
                
            });
        }

    }catch(e){
        message.error('Mesajınız Gönderilemedi..');
    }
    // setSending(false)
  }
  const setUserSignIn = async() => {
    window.localStorage.removeItem("phone")
    window.localStorage.removeItem("password")
    window.localStorage.setItem("phone", loginPhone)
    window.localStorage.setItem("password", loginPassword)
  }
  return (
    <div className="App">
      <input placeholder='Mesajınız' type="text" onChange={(event) => setText(event.target.value)}/>
      <button onClick={sendData}>Mesajı Gönder</button>
      <button onClick={()=>( setDatas([]) )}>Temizle</button>
      {datas.map((eleman, index)=>{
        <h2 className="msg-left">{eleman.text}</h2>

      })}

      <div className="login">
      <h2>KAYIT</h2>
      <input placeholder='Adınız' type="text" onChange={(event) => setName(event.target.value)}/>
      <input placeholder='Telefon Numaranız' type="text" onChange={(event) => setPhone(event.target.value)}/>
      <input placeholder='Şifreniz' type="text" onChange={(event) => setPassword(event.target.value)}/>

      <button onClick={setUserSignUp}>Kaydet</button>
      </div>

      <div className="login">
      <h2>GİRİŞ</h2>
      <input placeholder='Telefon Numaranız' type="text" onChange={(event) => setLoginPhone(event.target.value)}/>
      <input placeholder='Şifreniz' type="text" onChange={(event) => setLoginPassword(event.target.value)}/>

      <button onClick={setUserSignIn}>Kaydet</button>
      </div>
    </div>
  );
}

export default App;
