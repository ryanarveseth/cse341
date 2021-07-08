import React, {useCallback, useContext, useEffect, useState} from "react";
import {SocketContext} from "./SocketContext";
import {CenteredModalNoTop, DisconnectButton, Flex, MessagesFlexbox, Page, SendButton, TextArea} from "../styles";
import IndividualMessage from "./IndividualMessage";

const Chat = ({userName, setIsLoggedIn, setUserName}) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([{
    message: `${userName} has entered the chat.`,
    time: new Date().toLocaleTimeString(),
    from: "ChatterBot"
  }]);
  const [newChat, setNewChat] = useState("");
  const [usersOnline, setUsersOnline] = useState(0);

  useEffect(() => {

    const fetchUserCount = async () => {
      const users = (await (await fetch("/api/users-online")).json()).users;
      setUsersOnline(users);
      socket.emit("new-count", users);
    }

    fetchUserCount();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("new-message", (message) => {
      setMessages(prevState => [...prevState, message]);
    });

    socket.on("new-user-count", (count) => setUsersOnline(count));

    return () => {
      socket.off("new-message");
      socket.off("new-user-count");
    }
    // eslint-disable-next-line
  }, [userName]);

  const sendChat = useCallback(() => {
    const newMessage = {
      message: newChat,
      from: userName,
      time: new Date().toLocaleTimeString()
    };

    if (newChat && newChat.trim()) {
      socket.emit("new-chat", {...newMessage});

      setMessages(prevState => [...prevState, {...newMessage}]);
      setNewChat("");
    }
  }, [newChat, socket, userName]);

  useEffect(() => {
    const enterClicked = (e) => {
      if (e && e.code && (e.code === "Enter" || e.code === "NumpadEnter")) {
        return sendChat();
      }
    }
    document.addEventListener("keydown", enterClicked);

    return () => {
      document.removeEventListener("keydown", enterClicked);
    }
  }, [sendChat]);

  const disconnect = async () => {
    await (fetch("/api/logout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userName: userName})
    }));


    socket.emit("new-chat", {
      message: `${userName} disconnected from the chat.`,
      time: new Date().toLocaleTimeString(),
      from: "ChatterBot",
      disconnected: true
    });

    if (usersOnline) {
      socket.emit("new-count", usersOnline - 1);
    }

    setUserName("");
    setIsLoggedIn(false);
  }

  return (
    <Page>
      <CenteredModalNoTop>
        <DisconnectButton onClick={disconnect} style={{cursor: "pointer"}}>
          Disconnect From Chat
        </DisconnectButton>
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <div>
            Users Online: {usersOnline}
          </div>
          <div>
            Logged In As: {userName}
          </div>
        </div>
        <MessagesFlexbox>
          {messages.map(chat => <IndividualMessage key={`${chat.from}_${chat.time}`} chat={chat} userName={userName}/>)}
        </MessagesFlexbox>
        <Flex style={{width: "100vw", maxWidth: "600px"}}>
          <TextArea style={{width: "calc(100% - 108px)", maxWidth: "calc(100% - 108px)", marginRight: "8px"}}
                    value={newChat} onChange={(e) => setNewChat(e.target.value)}/>
          <SendButton onClick={sendChat}>
            Send
          </SendButton>
        </Flex>
      </CenteredModalNoTop>
    </Page>
  );
}

export default Chat;