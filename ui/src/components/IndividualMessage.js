import React from "react";
import {Message} from "../styles";

const IndividualMessage = ({chat, userName}) => {
  const {from, message, time} = chat;
  const fromBot = from === "ChatterBot";
  const fromMe = from === userName;

  const backgroundColor = fromBot ?
    "#60F865" :
    fromMe ?
      "#377FEA" :
      "#EEEEEE";

  const color = fromMe ? "white" : "black";
  const styles = {
    ...(fromMe && {borderBottomRightRadius: "0"}),
    ...(fromBot && {borderTopLeftRadius: "0"}),
    ...(!fromMe && !fromBot && {borderBottomLeftRadius: "0"}),
  }

  return (
    <div style={{alignSelf: fromMe ? "flex-end" : "flex-start"}}>
      <small>
        {from}
      </small>
    <Message style={{backgroundColor: backgroundColor, color: color, ...styles}}>
      <div>
        {message}
      </div>
      <small>
        {time}
      </small>
    </Message>
    </div>
  );
}

export default IndividualMessage;