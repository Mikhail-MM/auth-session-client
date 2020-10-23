import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { parseAxiosError } from '../utils/network/parseAxiosError';
import { initializeConnection } from '../utils/websocket/socket';

import config from '../config';
const  { rootURI, webSocketURI } = config;

const mapStateToProps = ({ user, isAuthenticated }) => ({
  user,
  isAuthenticated,
});

const roomRequestConfiguration = {
  url: `${rootURI}/chatrooms`,
  method: 'GET',
  withCredentials: true,
}

const messagesByRoomRequestConfiguration = (id) => ({
  url: `${rootURI}/messages/rooms/${id}`,
  method: 'GET',
  withCredentials: true,
})

const getUsersByRoomRequestConfiguration = (id) => ({
  url: `${rootURI}/users/rooms/${id}`,
  method: 'GET',
  withCredentials: true,
});

const maxRetries = 10;

function Chat({ user, isAuthenticated, toast }) {
  const webSocketInstance = useRef(null);

  const [activeView, setActiveView] = useState('chatrooms');
  const [activeRoom, setActiveRoom] = useState(null);

  const [chatrooms, setChatRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  const [socketConnected, setSocketConnected] = useState(false);
  const [retries, setRetries] = useState(0);

  const onViewChange = (e) => {
    const { viewkey } = e.target.dataset;
    setActiveView(viewkey);
  }

  const onRoomClick = (e) => {
    const { id } = e.target.dataset;
    setActiveRoom(Number(id));
  }

  const onNewMessageSubmit = (e) => {
    const { user_id, email } = user;
    e.preventDefault();
    console.log(webSocketInstance.current);
    webSocketInstance.current.send(
      JSON.stringify({
        message: newMessage,
        chatroom_id: activeRoom,
        type: 'messages/createMessage',
        user_id, 
        email
      })
    );
    setNewMessage("");
  }

  const onMessageBoxChange = (e) => {
    setNewMessage(e.target.value);
  }

  useEffect(() => {
    if (webSocketInstance.current) {
      console.log(webSocketInstance.current.readystate)
    }
    if (isAuthenticated && (!webSocketInstance.current || webSocketInstance.current.readyState === 3)) {
      webSocketInstance.current = initializeConnection({ toast, setMessages, retries, setRetries });
    }
  }, [isAuthenticated, toast, retries]);

  // Unmount Clean Up
  useEffect(() => {
    return () => {
      if (webSocketInstance.current) {
        webSocketInstance.current.unmounted = true;
        webSocketInstance.current.close();
      }
    }
  }, []);

  /*
  useEffect(() => {
    // Always use the most up-to-date instance ref property.
    if (webSocketInstance.current && !webSocketInstance.current.connected) {
      const interval = setInterval(() => {
        if (retries < maxRetries) {
          console.log("Forcing a re-render.")
          // Force a re-render to cause the first webSocket responsible effect to re-run.
          setRetries((retries) => retries + 1);
        }
      }, 5000)
      return () => clearInterval(interval);
    }
  }, [socketConnected, retries]);

  useEffect(() => {
    return () => {
      if (webSocketInstance.current) {
        webSocketInstance.current.close();
      }
    }
  }, []);

  */
  useEffect(() => {
    if (isAuthenticated && !chatrooms.length) {
      setLoadingRooms(true)
      axios(roomRequestConfiguration).then(({ data }) => {
        setChatRooms(data);
      }).catch(err => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Error Fetching Chat',
          detail: parsed,
        });
      }).finally(() => setLoadingRooms(false));
    }
  }, [isAuthenticated, toast, chatrooms]);

  useEffect(() => {
    if (activeRoom) {

      setLoadingUsers(true);
      const userRequestConfig = getUsersByRoomRequestConfiguration(activeRoom);
      axios(userRequestConfig).then(({ data }) => {
        console.log("Got Users", data);
        setUsers(data);
      }).catch(err => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Error Fetching Users in Chatroom',
          detail: parsed,
        });
      }).finally(() => {
        setLoadingUsers(false);
      })
    
      setLoadingMessages(true);
      const messageRequestConfig = messagesByRoomRequestConfiguration(activeRoom);
      axios(messageRequestConfig).then(({ data }) => {
        console.log("Got messages", data)
        setMessages(data);
      }).catch(err => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Error Fetching Messages',
          detail: parsed,
        });
      }).finally(() => {
        setLoadingMessages(false);
      });

    }
  }, [toast, activeRoom]);

  if (!isAuthenticated) {
    return <div className="pb-48 w-full h-full flex items-center justify-center"> Please Log In! </div>
  }

  return <div className="relative w-full h-full">
    <div className="flex absolute inset-3 border border-gray-600">
      <div className="h-full w-64 min-w-64 flex flex-col border border-gray-600">
        <div className="h-auto flex">
          <div onClick={onViewChange} data-viewkey="chatrooms" className={`w-1/2 text-center border border-gray-600 ${activeView === 'chatrooms' && "text-red-600"}`}>
            Rooms
          </div>
          <div onClick={onViewChange} data-viewkey="users" className={`w-1/2 text-center border border-gray-600 ${activeView === 'users' && "text-red-600"}`}>
            Users
          </div>
        </div>
        <div className="feed">
          {
            activeView === 'chatrooms' ? 
            chatrooms.map(({ name, id }) => {
              return <div onClick={onRoomClick} className={`${activeRoom === id && 'text-red-400'}`} key={id} data-id={id}>
                { name }
              </div>
            }) : users.map(({ email, id }) => <div key={id} data-id={id}> {email} </div>)
          }
        </div>
      </div>
      <div className="flex flex-col border flex-grow border-gray-600">
        <div className="messagebox flex-grow w-full flex flex-col">
          {
            messages.map(({ id, created_at, message, created_by }) => <div key={id} data-id={id}>
                <div className="flex flex-wrap w-full"> 
                  <strong>{created_by} ({created_at}):</strong>
                  <span>{message}</span>
                </div>
              </div>
            )
          }
        </div>
        <div className="forminput w-full h-10 border border-gray-600">
          <form onSubmit={onNewMessageSubmit} className="h-full w-full flex">
            <input onChange={onMessageBoxChange} className="h-full border border-gray-600 flex-grow" type="text" value={newMessage}/>
            <input disabled={!activeRoom} className="h-full border border-gray-600 w-48" type="submit" value="Send Message" />
          </form>
        </div>
      </div>
    </div>
  </div>
}

export default connect(mapStateToProps)(Chat);