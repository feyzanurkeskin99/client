import React, { memo, useContext, useEffect, useState } from 'react';
import { AppContext } from '../Components/Context'
import { HeaderIcons } from '../icon';
import InlineSVG from 'svg-inline-react';
import { Avatar, message, Modal } from 'antd';
import {useParams} from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import SocketIO from "socket.io-client";
import DailyIframe from '@daily-co/daily-js';
const { confirm } = Modal;

const socket=SocketIO("http://localhost:3001",  { transports: ['websocket', 'polling', 'flashsocket'] ,
auth: (cb) => {
  cb({
    token: localStorage.getItem("email").split(",")[2].split('"')[3]
  });
}
})
const Header=memo(({email, name, activeUsers})=> {  
  var {loginEmail, setLoginEmail} = useContext(AppContext);
  const [status, setStatus]=useState([]);
  const navigate = useNavigate()

  // const decoded = jwt_decode(activeUsers[0].Token)
  let { id } = useParams();


  useEffect(()=>{
    const fetchData=async()=> {
      try {
        const arr = []
        const arr2 = []
        await activeUsers.map((element)=>(
          arr.push(jwt_decode(element.Token))
        ))
        await arr.map((active)=>(
          active.email === id.split("-")[1] ? 
          (arr2.push(active))
          :
          (<></>)
        ))
        setStatus(arr2)
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();

  },[activeUsers])

  useEffect(()=>{
    // eslint-disable-next-line no-unused-expressions
    !status.length ? (document.querySelector(':root').style.setProperty('--status-color', "#b01e1e"))
    : 
    (email === status[0].email ? 
      document.querySelector(':root').style.setProperty('--status-color', "#00e200") 
      : 
      document.querySelector(':root').style.setProperty('--status-color', "#b01e1e")
      )

  },[status])

  useEffect(()=>{
    socket.on('joined-call', (data)=>{
        data.ToEmail === loginEmail.email ? (
        showDeleteConfirm(name)
      ):(
        console.log("olmadı gülüm")
      )
    })
    socket.on('reject-call', (data)=>{
      if(data.ToEmail === loginEmail.email){
        message.error("Arama Reddedildi")
        window.location.reload(false) 
      }else{
        console.log("olmadı gülüm")
      }
    })
  },[])

  const callWarning=()=>{
    socket.emit('call',{
      Email: loginEmail.email, //aramayı yapan kişi
      ToEmail: id.split("-")[1]
    })
  }

  const showDeleteConfirm=(data)=> {
    console.log(data)
    confirm({
      title: data +' Arıyor',
      icon: <></>,
      content: 'Aramayı Kabul Etmek İstiyor Musunuz?',
      okText: 'Evet',
      okType: 'danger',
      cancelText: 'Hayır',
      onOk() {
        acceptCall()
      },
      onCancel() {
        rejectCall()
      },
    });
  }
  const  createFrameAndJoinRoom = () => {
    const MY_IFRAME = document.createElement('iframe');
    MY_IFRAME.setAttribute(
      'allow',
      'microphone; camera; autoplay; display-capture'
    );
        
    document.body.appendChild(MY_IFRAME);

    //let callFrame = DailyIframe.wrap(MY_IFRAME, iframeProperties);
    let callFrame = DailyIframe.createFrame({
      iframeStyle: {
        position: 'fixed',
        border: '1px solid black',
        width: '100%',
        height: '100%'
      },
      dailyConfig: {
        micAudioMode: 'music',
      },
      showLeaveButton: true
    })
    callFrame.join({ url: 'https://socket-chatapp.daily.co/chatapp' });

    callFrame
        .on('joined-meeting', (event) => {
          callWarning()
          console.log('joined-meeting event', event);
        })
        .on('left-meeting', (event) => { //kullanıcının görüşmeden ayrıldığını belirtir
          window.location.reload(false) 
        });
  }
  const  acceptCall = () => {
    const MY_IFRAME = document.createElement('iframe');
    MY_IFRAME.setAttribute(
      'allow',
      'microphone; camera; autoplay; display-capture'
    );
        
    document.body.appendChild(MY_IFRAME);

    //let callFrame = DailyIframe.wrap(MY_IFRAME, iframeProperties);
    let callFrame = DailyIframe.createFrame({
      iframeStyle: {
        position: 'fixed',
        border: '1px solid black',
        width: '100%',
        height: '100%'
      },
      dailyConfig: {
        micAudioMode: 'music',
      },
      showLeaveButton: true
    })
    callFrame.join({ url: 'https://socket-chatapp.daily.co/chatapp' });

    callFrame
        .on('joined-meeting', (event) => {
          console.log('joined-meeting event', event);
        })
        .on('left-meeting', (event) => { //kullanıcının görüşmeden ayrıldığını belirtir
          window.location.reload(false) 
        });
  }
  const rejectCall = () =>{
    socket.emit('rejectCall',{
      Email: loginEmail.email, //reddetmeyi yapan kişi
      ToEmail: id.split("-")[1]
    })
  }
    return (
      <AppContext.Provider value={{loginEmail, setLoginEmail}}>
                <div className="header">
                <InlineSVG src={HeaderIcons.prev} onClick={()=> navigate('/')}></InlineSVG>
                <div className="header-icon"><Avatar onClick={()=> navigate("/person-info/"+email+"+"+name)} size={50} icon={<UserOutlined />} /></div>
                <div className="header-name">
                  <div className="name">{name}</div>
                  <div className="online-status">
                    {!status.length ? ("offline") : (email === status[0].email ? "online" : "offline")}
                  </div>
                </div>
                <div className="call-center">
                  <div className="voice-call-button" onClick={() => createFrameAndJoinRoom()}>
                    <InlineSVG src={HeaderIcons.voiceCall}/>
                  </div>
                  <div className="video-call-button">
                    <InlineSVG src={HeaderIcons.videoCall}/>
                  </div>
                </div>
                {/* <InlineSVG src={HeaderIcons.phone}/> */}
                </div>

            
      </AppContext.Provider>
    );
  
})

export default memo(Header);
