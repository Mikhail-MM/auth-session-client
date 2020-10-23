import config from '../../config';
const  { webSocketURI } = config;

const maxRetries = 5;

const initializeConnection = ({ toast, setMessages, retries, setRetries }) => {
  const webSocket = new WebSocket(webSocketURI);
  webSocket.onopen = (event) => {
    if (!webSocket.unmounted) {
      toast.current.show({
        sticky: true,
        severity: 'success',
        summary: 'WebSocket Connection Established',
      });
    }
  }

  webSocket.onmessage = (event) => {
    if (!webSocket.unmounted) {
      console.log("Message Event Recieved", event)
      const parsed = JSON.parse(event.data);
      const { type, message } = parsed;
      switch(type) {
        case 'error': {
          return toast.current.show({
            sticky: true,
            severity: 'error',
            summary: 'Server Returned Websocket Error',
            detail: message,
          });
        }
        case 'notification': {
          return toast.current.show({
            sticky: true,
            severity: 'info',
            summary: message,
          });
        }
        case 'messages/createMessage': {
          const { created_by, created_at }  = parsed;
          return setMessages((messages) => {
            return messages.concat([{
              message,
              created_by,
              created_at,
            }])
          })
        }
        default: {
          return toast.current.show({
            sticky: true,
            severity: 'error',
            summary: 'Server sent unidentified packet type.',
          });
        }
      }
    }
  }

  webSocket.onerror = (event) => {
    toast.current.show({
      sticky: true,
      severity: 'error',
      summary: 'Server Returned Websocket Error',
      detail: "WebSocket onError",
    });
    if (retries < maxRetries) {
      setTimeout(() => {
        toast.current.show({
          sticky: true,
          severity: 'info',
          summary: 'Attempting Reconnection',
        });
        setRetries((retries) => retries + 1);
      }, 500)
    } else {
      toast.current.show({
        sticky: true,
        severity: 'info',
        summary: 'Max Retry Reached',
      });
    }
  }

  webSocket.onclose = (event) => {
    if (!webSocket.unmounted) {
      console.log("Websocket Closed by Server")
      toast.current.show({
        sticky: true,
        severity: 'info',
        summary: 'Websocket Close Event',
      });
    } else {
      console.log("Websocket Closed, unmounted.")
      toast.current.show({
        sticky: true,
        severity: 'info',
        summary: 'Disconnected from Chat',
      });
    }
  }
  return webSocket;
}


export { initializeConnection };
