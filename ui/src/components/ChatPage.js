import React, {useState} from "react";
import Login from "./Login";
import Chat from "./Chat";

const ChatPage = () => {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ?
    <Chat userName={userName}
          setIsLoggedIn={setIsLoggedIn}
          setUserName={setUserName}/> :
    <Login userName={userName}
           setIsLoggedIn={setIsLoggedIn}
           setUserName={setUserName}/>
}

export default ChatPage;