import styled from "styled-components";

export const Page = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 1184px;
  margin: 0 auto;
`;

export const Input = styled.input`
  height: 30px;
  width: 200px;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 16px;
  
    &:focus {
    outline: none;  
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const TextArea = styled.textarea`
  resize: vertical;
  border-radius: 8px;
  padding: 12px 12px;
  font-size: 16px;
  
  &:focus {
    outline: none;  
  }
`;

export const CenteredModal = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
`;

export const CenteredModalNoTop = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
`

export const SendButton = styled.button`
  padding: 8px 16px;
  color: #20bf6b;
  background: transparent;
  border: 2px solid #20bf6b;
  transition: .4s ease;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    color: #222222;
    background: #20bf6b;
    transition: .4s ease;
  }
`;

export const DisconnectButton = styled(SendButton)`
  color: FireBrick;
  border: 2px solid FireBrick;
  
  &:hover {
    background: FireBrick;
  }
  
  margin-bottom: 16px;
`;

export const Message = styled.div`
  border-radius: 16px;
  padding: 12px 24px;
  margin-top: 4px;
  margin-bottom: 4px;
  width: fit-content;  
`

export const MessagesFlexbox = styled.div`
  display: flex;
  flex-direction: column;
  background: #444444;
  padding: 32px;
  border-radius: 32px;
  margin-bottom: 32px;
  overflow: auto;
  max-height: 500px;
`;