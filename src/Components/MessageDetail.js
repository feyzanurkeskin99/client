import SocketIO from "socket.io-client";
import { memo, useEffect, useState } from 'react';
import { getApiModels, deleteApiModelsFetch } from '../Models/ApiModels';
import {useLocalStorageState} from './utils'
import { AppContext } from './Context'
import Header from "./Header";
import { InputIcons } from "../icon";
import InlineSVG from 'svg-inline-react';
import {useParams} from 'react-router-dom'
import {Input, Dropdown, Menu, message, Modal} from 'antd'
import Picker from 'emoji-picker-react';
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'
const { confirm } = Modal;

const { TextArea } = Input;
// const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] ,
// auth: (cb) => {
//   cb({
//     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZleXphbnVyQGdtYWlsLmNvbSIsIm5hbWUiOiJGZXl6YW51ciIsImlhdCI6MTY1MjEwMDY5NywiZXhwIjoxNjUyMTA3ODk3fQ.9iYyoNRN5nU_issVVLGXnCbBYRzcZ5xSwIP22oPKuvY"
//   });
// }
// })

  const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] ,
  auth: (cb) => {
    cb({
      token: localStorage.getItem("email").split(",")[2].split('"')[3]
    });
  }
  })
const date=new Date()

  const counterDate = (array, date)=>{
    if(!array.includes(date)){ //bu eleman dizide mevcut değilse
      array.push(date);
      return false;
    }else if(array === []){
      array.push(date)
      return false;
    }
    else{
      return true;
    }

  }
const MessageArea = memo(({messages, loginEmail, id, menu}) => {
  var infoDate= []
  return (
      messages.map((message, index)=>
        ((message.Email === loginEmail.email) ?
            <h2 key={Math.random()*1000} className="msg-right-container">
            <div>

            {//tarih kontrolü
              counterDate(infoDate, message.Date) ? (
                <></>
              ) : (
                <div className="msg-right-date-container">
                <div className="msg-date">{new Date(date).toLocaleString('tr', {day:"numeric", month:"long", year:"numeric"}) === message.Date ? "Today" : message.Date}</div>
                </div>
              )
            }

            <div className="msg-right" >
            {
              message.Message ? (
                //<audio className="audio-right" controls="controls" src={message.Message} type="audio/mp3" />
                message.Message.charAt(0).toUpperCase() + message.Message.slice(1)
                ):(<></>)}
                <Dropdown 
                overlay={
                  <Menu>
                    <Menu.Item key="display" type="dashed" onClick={() => showDeleteConfirm(message)}>
                        Mesajı Sil
                      </Menu.Item>
                  </Menu>
                }
                trigger={['hover']}>
                <div
                  className="messages-context-menu"
                >
                </div>
              </Dropdown>
            <div className="message-time">{message.Time.split(":")[0]}:{message.Time.split(":")[1]}</div>
            </div>
            </div>
            </h2>
          : (message.Email === id.split('-')[1]) ?
          <h2 key={Math.random()*1000} className="msg-left-container">
            <div>
            {//tarih kontrolü
              counterDate(infoDate, message.Date) ? (
                <></>
              ) : (
                <div className="msg-left-date-container">
                <div className="msg-date">{new Date(date).toLocaleString('tr', {day:"numeric", month:"long", year:"numeric"}) === message.Date ? "Today" : message.Date}</div>
                </div>
              )
            }
            <div className="msg-left" >
            {
              message.Message ? (
                message.Message.charAt(0).toUpperCase() + message.Message.slice(1)
                ):(<></>)
            }
            <Dropdown 
            overlay={
            <Menu>
                    <Menu.Item key="display" type="dashed" onClick={() => showDeleteConfirm(message)}>
                        Mesajı Sil
                      </Menu.Item>
                  </Menu>
            } trigger={['hover']}>
              <div
                className="messages-context-menu"
              >
              </div>
            </Dropdown>
            <div className="message-time">{message.Time.split(":")[0]}:{message.Time.split(":")[1]}</div>
            </div>
            </div>
          </h2>
          : <></>)
      )
  )
})

const showDeleteConfirm=(message)=> {
  console.log(message)
  confirm({
    title: 'Bu Mesajı Silmek İstediğinizden Emin Misiniz??',
    icon: <></>,
    content: 'Bu Silme İşlemi Geri Alınamaz!!',
    okText: 'Evet',
    okType: 'danger',
    cancelText: 'Hayır',
    onOk() {
      deleteMessageApi(message)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

const deleteMessageApi = async(message) => {
  // try{
        const obj={};
          obj.Message= message.Message;
          obj.Email= message.Email;
          obj.Name= message.Name;
          obj.date= message.Date;
          obj.Time= message.Time;
          obj.ToName= message.ToName;
          obj.ToEmail= message.ToEmail;
          deleteApiModelsFetch("/messages",{Delete:obj})
          .then(result=>{
                if(result.status) {
                  window.location.reload(false) 
                  message.success('Mesaj Silindi..')
                }else{
                  if(result.statusCode === 300){
                      message.error("Bir Hata Oldu, Mesajı Silmeyi Tekrar Deneyiniz...")
                  }else{
                      message.error('Bir Şeyler Ters Gitti, Mesajı Silmeyi Tekrar Deneyiniz..')
                  }       
                  }
            });
  // }catch(e){
  //     alert(e.message)
  // }
}





  //mesaja basılı tutma eventi
  const keydownFunction=(e)=> {
    setTimeout(() =>{
      alert(e)
      },1500)
    }

    const keyupFunction=(e)=> {
      document.getElementById("demo").style.backgroundColor = "green";
    }
    //mesaja basılı tutma eventi kapandı

const MessageDetail =({token, activeUsers})=> {

  const [loginEmail, setLoginEmail] = useLocalStorageState("email", "");
  const [text, setText]=useState('');
  const [submit, setSubmit]=useState(false);
  const [datas, setDatas]=useState([]);
  const [messages, setMessages]=useState([]);
  const [socketMessages, setSocketMessages]=useState([]);
  const [state, setState] = useState({audioDetails:{
    url: null,
    blob: null,
    chunks: null,
    duration: {
    h: null,
    m: null,
    s: null,
    }
    }});


  //url den id'yi çekmek için
  let { id } = useParams();

  useEffect(()=>{
    window.scrollTo(0, document.body.scrollHeight);
  },[messages])


  socket.on('message', async(data)=>{

    setMessages([...messages, data])

  })

  useEffect(()=>{
    getMessagesApi()
  },[id])

  useEffect(()=>{
    socket.on('token_verify_socket', (data)=>{
      console.log(data)
    })
      // Execute a function when the user releases a key on the keyboard
    document.getElementById("msgInput").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.which === 13 && !event.shiftKey) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a clicks
      document.getElementById("msgSend").click();
      document.querySelector(".emoji-picker-react").classList.add("hidden")
    }
  });
  document.querySelector(".emoji-picker-react").classList.add("hidden")
  //document.querySelector("._2uz65._1bSom").addEventListener("click", sendVoice())
  },[])



  const getMessagesApi = async() => {
      try{
          const res = await getApiModels("/messages?email="+loginEmail.email+"&toEmail="+id.split('-')[1]);
          setSocketMessages([])
          if(res.status) {
            setMessages(res.data)
            setSocketMessages(res.data)
          }
      }catch(e){
          alert(e.message)
      }
  }

  // const setMessagesApi = async() => {
  //   // setSending(true)
  //   // form.submit();


  // socket.on('message', (data)=>{
  // console.log(data)
  //   try{
  //     const obj={};
  //     if(loginEmail === '' || id === ''){
  //         message.error('Mesaj Gönderilemedi, Zorunlu Alanları Doldurunuz..')
  //     }else if(loginEmail.email === data.email){
  //         obj.Message= data.text;
  //         obj.Email= loginEmail.email;
  //         obj.Name= loginEmail.name;
  //         obj.date= data.date;
  //         obj.Time= data.time;
  //         obj.ToName= data.to;
  //         obj.ToEmail= data.toEmail;
  //         // obj.Password= password;
  //         setMessagesApiModels("/messages",{Messages:obj})
  //         .then(result=>{
  //               if(result.status === true) {
  //                 getMessagesApi()
  //                 message.success('Mesaj Gönderildi..')
  //               }else{
  //                 if(result.statusCode === 300){
  //                     message.error("Bir Hata Oldu, Mesaj Göndermeyi Tekrar Deneyiniz...")
  //                 }else{
  //                     message.error('Bir Şeyler Ters Gitti, Mesaj Göndermeyi Tekrar Deneyiniz..')
  //                 }

  //                 }
  //           });
  //     }else if(loginEmail.email === data.toEmail){
  //       getMessagesApi()
  //     }else{
  //       message.error('Mesaj Gönderilemedi, Tekrar Dene..')
  //     }
  // }catch(e){
  //     message.error('Mesaj Gönderilemedi.. '+e);

  // }
  // })
  // }

  const sendData=()=>{
    const date=new Date()
    if(text !== '' && text!== ' '){
    socket.emit('dataMsg',{
      msg:text,
      email:loginEmail.email,
      name:loginEmail.name,
      date: new Date(date).toLocaleString('tr', {day:"numeric", month:"long", year:"numeric"}),
      time:(date.toString()).split(" ")[4],
      to:id.split('-')[0],
      toEmail:id.split('-')[1]
    })
    }else{
      alert('lütfen mesaj giriniz..')
    }
    document.getElementById('msgInput').value=''
    setText('')
    window.scrollTo(0, document.body.scrollHeight);

    // console.log(date)
    // console.log(new Date(date).toLocaleString('tr', {day:"numeric", month:"long", year:"numeric"}))
    // setMessagesApi()
  }

  const sendVoice=(url)=>{
    const date=new Date()
    if(url !== null){
      // var blob = new Blob(url.chunks, { 'type' : 'audio/*; codecs=opus' });
      const file = new File([url.blob],"audio.mp3", { 'type' : 'audio/*; codecs=opus' })
      console.log(url)
      socket.emit('dataMsg',{
      msg:file,
      email:loginEmail.email,
      name:loginEmail.name,
      date: new Date(date).toLocaleString('tr', {day:"numeric", month:"long", year:"numeric"}),
      time:(date.toString()).split(" ")[4],
      to:id.split('-')[0],
      toEmail:id.split('-')[1]
    })
    }else{
      alert('lütfen mesaj giriniz..2')
    }
    document.getElementById('msgInput').value=''
    setText('')
    window.scrollTo(0, document.body.scrollHeight);

    // console.log(date)
    // console.log(new Date(date).toLocaleString('tr', {day:"numeric", month:"long", year:"numeric"}))
    // setMessagesApi()
  }

  const onEmojiClick = (event, emojiObject) => {
    setText(text + emojiObject.emoji);
  };

  const handleAudioStop=async(data)=>{
    console.log(data)
    document.querySelector("._3neb0")?.classList.add("hidden")
    document.querySelector(".voice-send").classList.remove("hidden")
    document.querySelector(".voice-trash").classList.remove("hidden")
    await setState({ audioDetails: data });
  }



  const handleRest =()=>{
    const reset = {
    url: null,
    blob: null,
    chunks: null,
    duration: {
    h: null,
    m: null,
    s: null,
    }
    }
    setState( {audioDetails: reset} );
  }

  useEffect(()=>{
    console.log(state.audioDetails.url)
  },[state])

  useEffect(()=>{
    if(text !== ''){
      document.querySelector(".input-svgs").classList.remove("hidden")
      document.querySelector("._1ceqH").classList.add("hidden")
    }else{
      document.querySelector(".input-svgs").classList.add("hidden")
      document.querySelector("._1ceqH").classList.remove("hidden")
    }
  },[text])


    return (
      <AppContext.Provider value={{loginEmail, setLoginEmail}}>
              <div className="App messages-app">
                <Header email={id.split('-')[1]} name={id.split('-')[0]} activeUsers={activeUsers}/>
                <div className="messages-container"><MessageArea loginEmail={loginEmail} messages={messages} id={id} /></div>
                {/* <Recorder
                  record={false}
                  audioURL="blob:http://localhost:3000/6579ba4d-3cb9-404c-8e01-d0cb1bb3c7e0"
                  showUIAudio /> */}
                <div className="input-message">
                <Recorder
                  record={true}
                  audioURL={state.audioDetails.url}
                  showUIAudio
                  handleAudioStop={(data) => handleAudioStop(data)}
                  handleRest={() => handleRest()} />
                <InlineSVG className="voice-trash hidden" onClick={()=>
                {handleRest()
                  document.querySelector("._1ceqH").classList.remove("hidden")
                  document.querySelector(".voice-trash").classList.add("hidden")
                  document.querySelector(".voice-send").classList.add("hidden")}
                } src={InputIcons.trash}/>
                <Picker onEmojiClick={onEmojiClick} />

                <TextArea value={text} autoSize id="msgInput" placeholder='Mesajınızı yazın..' type="text" onChange={(event) => setText(event.target.value)}/>
                <div className="input-svgs hidden"> <InlineSVG src={InputIcons["emoji-picker"]} onClick={()=> document.querySelector(".emoji-picker-react").classList.toggle("hidden")}/>
                <InlineSVG id="msgSend" onClick={()=>
                {sendData()
                document.querySelector(".emoji-picker-react").classList.add("hidden")}
                } src={InputIcons.send}></InlineSVG>
                </div>
                <InlineSVG id="voiceSend" onClick={()=>
                {sendVoice(state.audioDetails)
                  handleRest()

                  document.querySelector("._1ceqH").classList.remove("hidden")
                  document.querySelector(".voice-trash").classList.add("hidden")
                  document.querySelector(".voice-send").classList.add("hidden")
                }
                } className='voice-send hidden' src={InputIcons.send}></InlineSVG>
                {/* <button onClick={()=>( setDatas([]) )}>Temizle</button> */}
                </div>
              </div>
      </AppContext.Provider>
    );

}

export default MessageDetail;
