import React, {useCallback, useContext, useEffect, useState} from "react";
import {CenteredModal, Input, Page, SendButton} from "../styles";
import {SocketContext} from "./SocketContext";


const emptyError = {code: 0, message: ""};

const Login = ({userName, setUserName, setIsLoggedIn}) => {
  const [error, setError] = useState({...emptyError});
  const socket = useContext(SocketContext);

  const submitUserName = useCallback(async () => {
    if (!userName) return setError({code: 1, message: "Username cannot be empty."});

    const result = await (await fetch("/api/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userName: userName})
    })).json();

    if (result && result.errors) {
      setError({code: result.errors.code, message: result.errors.message});
    } else {
      if (result && result.userName) {
        const date = new Date().toLocaleTimeString();
        setIsLoggedIn(true);
        socket.emit("new-user", userName, date);
      }
    }
  }, [setIsLoggedIn, socket, userName]);

  useEffect(() => {
    const enterClicked = (e) => {
      if (e && e.code && (e.code === "Enter" || e.code === "NumpadEnter")) {
        return submitUserName();
      }
    }

    document.addEventListener("keydown", enterClicked);

    return () => {
      document.removeEventListener("keydown", enterClicked);
    }
  }, [submitUserName]);

  useEffect(() => {
    if (error && error.code === 1 && userName) {
      setError({...emptyError});
    }
  }, [userName, error]);


  return (
    <Page>
      <CenteredModal>
        <Input placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)}/>
        &nbsp;&nbsp;
        <SendButton onClick={submitUserName}>
          Submit
        </SendButton>
        <div style={{color: "red", marginTop: "8px"}}>
          {
            error && error.message
          }
        </div>
      </CenteredModal>
    </Page>
  );
}

export default Login;