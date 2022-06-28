import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { HeaderIcons, InputIcons } from '../icon';
import InlineSVG from 'svg-inline-react';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../Components/Context'
import LogOut from './LogOut';
import { getApiModels } from '../Models/ApiModels';
import { Menu, Dropdown, Space, Button, Avatar, Empty, Spin } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';

const menu = (
    <Menu
      items={[
        {
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
        {
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
        {
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item (disabled)
            </a>
          ),
          disabled: true,
        },
        {
          danger: true,
          label: 'a danger item',
        },
      ]}
    />
  );
  
const ChatListElement=({name,email})=>{
    const navigate = useNavigate()
    return(
        <div className="chatlist-element-container">
            <div className="chatlist-element-icon"><Avatar onClick={()=> navigate("/person-info/"+email+"+"+name)} size={50} icon={<UserOutlined />} /></div>
            <div className="chatlist-element-info-container" /*onMouseDown={console.log("on mouse down")} onMouseUp={console.log("on mouse up")}*/>
                <div className="chatlist-element-info" onClick={()=> 
                navigate('/message-detail/'+name+'-'+email)}>
                <h2 className="chatlist-element-name">{name}</h2>
                <div className="chatlist-element-msg-spot">Msg spot</div>
                </div>
                <div className="chatlist-element-more">
                    <InlineSVG src={HeaderIcons.more}></InlineSVG>
                </div>
            </div>
        </div> 
    )
}



const moreChoices=()=>{
    document.querySelector('.more-choices-container').classList.toggle('hidden')
}

const Contacts=()=> {
    const navigate = useNavigate()
    const {loginEmail, setLoginEmail} = useContext(AppContext);
    const [contacts, setContacts] = useState([])
    const [sending,setSending] = useState(true)

    
    const getContactsApi = async() => {
        setSending(true)
        try{
            const res = await getApiModels("/contacts?ToEmail="+loginEmail.email);
            console.log(res.data)
            setContacts([])
            if(res.status) {
                setContacts(res.data)
            }
        }catch(e){
            alert(e.message)
        }
        setSending(false)


    }

    useEffect(()=>{
        getContactsApi()
    },[])
    
    useEffect(()=>{
        console.log(contacts)
    },[contacts])
    return (
        <>
            <div className="chatlist-header">
            <InlineSVG src={HeaderIcons.prev} onClick={()=> navigate('/')}></InlineSVG>

                <div className="header-icon"><Avatar size={50} icon={<UserOutlined />} /></div>
                <h2>{loginEmail.name}</h2>
                <InlineSVG onClick={()=> moreChoices()} className="chatlist-svg more" src={HeaderIcons.more}></InlineSVG>
                <div className="more-choices-container hidden">
                    <div className="more-choices">
                        <LogOut></LogOut>
                    </div>
                </div>
                <InlineSVG onClick={()=> navigate("/add-contact")} className="chatlist-svg person" src={HeaderIcons.addperson}></InlineSVG>
            </div>
            <Spin tip="Loading ..." spinning={sending}>
            <div className="chatlist-container">
                {contacts.length ? (contacts.filter((element)=> element.Name !== loginEmail.name).map((data)=>(
                    <ChatListElement key={Math.random()*1000} name={data.Name} email={data.Email}/>
                )))
                :
                ( <Empty /> )}
            </div> </Spin>
        </>
    )
}

export default Contacts;
