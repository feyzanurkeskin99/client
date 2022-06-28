import React, { memo, useContext, useEffect, useState } from 'react';
import { getApiModels } from '../Models/ApiModels';
import { AppContext } from '../Components/Context'
import  LogOut  from './LogOut'
import { HeaderIcons } from '../icon';
import InlineSVG from 'svg-inline-react';
import { Avatar } from 'antd';
import {useParams} from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

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
                <LogOut></LogOut>
                {/* <InlineSVG src={HeaderIcons.phone}/> */}
                </div>

            
      </AppContext.Provider>
    );
  
})

export default memo(Header);
