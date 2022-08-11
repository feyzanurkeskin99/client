import { UserOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderIcons, InputIcons } from "../icon";
import InlineSVG from "svg-inline-react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Components/Context";
import LogOut from "./LogOut";
import { getApiModels, deleteApiModels } from "../Models/ApiModels";
import {
  Menu,
  Dropdown,
  Badge,
  Button,
  Avatar,
  Empty,
  Spin,
  Modal,
  message,
} from "antd";
import SocketIO from "socket.io-client";
const { confirm } = Modal;

const socket = SocketIO("http://localhost:3001", {
  transports: ["websocket", "polling", "flashsocket"],
  auth: (cb) => {
    cb({
      token: localStorage.getItem("email").split(",")[2].split('"')[3],
    });
  },
});

const ChatListElement = ({ name, email, showDeleteConfirm, count, msg, status}) => {
  const navigate = useNavigate();
  return (
    <div className="chatlist-element-container">
      <div className="chatlist-element-icon">
        <Avatar
          onClick={() => navigate("/person-info/" + email + "+" + name)}
          size={50}
          icon={<UserOutlined />}
        />
      </div>
      <div
        className="chatlist-element-info-container" /*onMouseDown={console.log("on mouse down")} onMouseUp={console.log("on mouse up")}*/
      >
        <div
          className="chatlist-element-info"
          onClick={() => navigate("/message-detail/" + name + "-" + email)}
        >
          <h2 className="chatlist-element-name">{name}</h2>
          <div className="chatlist-element-msg-spot"> {status} {msg}</div>
        </div>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="display"
                onClick={showDeleteConfirm}
                type="dashed"
              >
                Sohbeti Sil
              </Menu.Item>
            </Menu>
          }
        >
          <div
            onClick={() => localStorage.setItem("deleteChat", email)}
            className="chatlist-element-more"
          >
            <InlineSVG src={HeaderIcons.more}></InlineSVG>
          </div>
          {/* <InlineSVG src={HeaderIcons.more}></InlineSVG> */}
        </Dropdown>
        <Badge count={count.email === email ? count.count : 0}></Badge>
        {/* <div className="chatlist-element-more">
                    <InlineSVG src={HeaderIcons.more}></InlineSVG>
                </div> */}
      </div>
    </div>
  );
};
// const contacts=[
//     {
//         name:"Ramazan",
//         email:"ramazan@gmail.com"
//     },
//     {
//         name:"Yasemin",
//         email:"yasemin@gmail.com"
//     },
//     {
//         name:"Feyzanur",
//         email:"feyzanur@gmail.com"
//     },
//     {
//         name:"Sueda",
//         email:"sueda@gmail.com"
//     },
//     {
//         name:"Zehra",
//         email:"zehra@gmail.com"
//     },
//     {
//         name:"Fatma",
//         email:"fatma@gmail.com"
//     }
// ]

const moreChoices = () => {
  document.querySelector(".more-choices-container").classList.toggle("hidden");
};

const ChatList = () => {
  const navigate = useNavigate();
  const { loginEmail, setLoginEmail } = useContext(AppContext);
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState([]);
  const [sending, setSending] = useState(true);
  const [count, setCount] = useState({
    email: "",
    count: 0,
  });
  const [refresh, setRefresh] = useState(parseInt(Math.random() * 1000));

  socket.on("message", (data) => {
    //getContactsApi()
    console.log(data.ToEmail === loginEmail.email ? data : false);
    if (data.ToEmail === loginEmail.email) {
      //mesaj gönderilen kişi bensem..
      setCount({ email: data.Email, count: count.count + 1 });
      const countMessage = {
        email: data.ToEmail,
        count: count.email === data.email ? count.count + 1 : count.count,
      };
      console.log(countMessage);
      localStorage.setItem("count", countMessage);
    } else {
      <></>;
    }
  });

  const deleteUserApi = async () => {
    try {
      deleteApiModels(
        "/messages?email=" +
          loginEmail.email +
          "&toEmail=" +
          localStorage.getItem("deleteChat")
      );
      message.success("Sohbet silindi..");
      setContacts(
        contacts.filter((item) => item.Email !== localStorage.deleteChat)
      );
      localStorage.removeItem("deleteChat");
      console.log(contacts);
    } catch (e) {
      alert(e.message);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Bu Sohbeti Silmek İstediğinizden Emin Misiniz??",
      icon: <></>,
      content: "Bu Silme İşlemi Geri Alınamaz!!",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        deleteUserApi();
        //getContactsApi()
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getContactApi = async () => { //bu metod tüm kişileri getiriyor. getContacts sadece mesajlaştığı kişileri
    setSending(true);
    try {
      const res = await getApiModels("/contacts?ToEmail=" + loginEmail.email);
      console.log(res.data);
      setContact([]);
      if (res.status) {
        setContact(res.data);
      }
    } catch (e) {
      alert(e.message);
    }
    setSending(false);
  };

  const getContactsApi = async () => {
    setSending(true);
    try {
      const res = await getApiModels("/messages?email=" + loginEmail.email);
      console.log(res.data);
      setContacts([]);
      if (res.status) {
        setContacts(res.data);
      }
    } catch (e) {
      alert(e.message);
    }
    setSending(false);
  };

  useEffect(() => {
    getContactsApi();
    getContactApi();
  }, []);

  useEffect(() => {
    setRefresh(parseInt(Math.random() * 1000));
  }, [contacts]);
  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <>
      <div className="chatlist-header">
        <div className="header-icon">
          <Avatar
            onClick={() => navigate("/person-info")}
            size={50}
            icon={<UserOutlined />}
          />
        </div>
        <h2>{loginEmail.name}</h2>
        <InlineSVG
          onClick={() => moreChoices()}
          className="chatlist-svg more"
          src={HeaderIcons.more}
        ></InlineSVG>
        <div className="more-choices-container hidden">
          <div className="more-choices">
            <LogOut></LogOut>
          </div>
        </div>
        <InlineSVG
          onClick={() => navigate("/add-contact")}
          className="chatlist-svg person"
          src={HeaderIcons.addperson}
        ></InlineSVG>
      </div>
      <Spin tip="Loading ..." spinning={sending}>
        <div className="chatlist-container" key={refresh}>
          {contacts.length ? (
            contacts
              .filter((element) => element.Name !== loginEmail.name)
              ?.map((data) => (
                <ChatListElement
                  key={Math.random() * 1000}
                  count={count}
                  showDeleteConfirm={showDeleteConfirm}
                  name={
                    contact.find((element) => element.Email === data.Email)
                      ? data.ToName
                      : data.Email
                  }
                  email={data.Email}
                  msg = {data.Message}
                  status= {data.Status}
                />
              ))
          ) : (
            <Empty />
          )}
        </div>{" "}
      </Spin>
      <div
        className="float-action-button"
        onClick={() => navigate("/contacts")}
      >
        <div className="button-container">
          {/* <InlineSVG src={InputIcons['chat-add']}></InlineSVG> */}
          <div>+</div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
