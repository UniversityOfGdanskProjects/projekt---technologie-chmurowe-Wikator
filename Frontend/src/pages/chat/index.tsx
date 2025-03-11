import MessageDto from "@/dtos/responses/messageDto";
import {useEffect, useRef, useState} from "react";
import {useUserContext} from "@/contexts/userContext";
import api from "@/api";
import {AxiosResponse} from "axios";
import mqttClient from "@/mqttClient";
import {useRouter} from "next/router";
import mqtt, {MqttClient} from "mqtt";

export default function Chat() {
  const [messages, setMessages] = useState<MessageDto[]>([])
  const { user } = useUserContext();
  const router = useRouter();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // MQTT client with only publish chat/message/api permission
  const [chatClient, setChatClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    mqttClient.subscribe('chat/message/validated');
    router.events.on('routeChangeStart', () => mqttClient.unsubscribe('chat/message/validated'));
    api.get("/message")
      .then((response: AxiosResponse<MessageDto[]>) => {
        if (messages.length === 0) {
          setMessages(response.data);
          setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 0);
        }
      });

    const handleMessageReceived = (event: CustomEvent) => {
      const scrollContainer = document.querySelector('.scroll-container');
      const isAtBottom = scrollContainer && scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight;

      setMessages(prevState => {
        const newMessages = [...prevState, event.detail.data];
        if (isAtBottom && lastMessageRef.current) {
          setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 0);
        }
        return newMessages;
      });
    }

    setChatClient(mqtt.connect("wss://85e67d8c7c8a4955a07dbd76348a5bba.s2.eu.hivemq.cloud/mqtt", {
      port: 8884,
      username: 'ClientChat',
      password: process.env.NEXT_PUBLIC_MQTT_CLIENT_CHAT_PASSWORD,
    }));

    window.addEventListener('mqttChatMessageReceived', handleMessageReceived as EventListener);

    return () => {
      mqttClient.unsubscribe('chat/message/validated');
      router.events.off('routeChangeStart', () => mqttClient.unsubscribe('chat/message/validated'));
      window.removeEventListener('mqttChatMessageReceived', handleMessageReceived as EventListener);
    }
  }, [user, router.events]);

  const sendMessage = (messageContent: string) => {
    if (!user || !chatClient) return;

    const message = {
      content: messageContent,
      jwt: user.token
    }

    chatClient.publish('chat/message/api', JSON.stringify(message));
  }

  return (
    <div className="container mt-4">
      <h3>Chat online with others!</h3>
      <hr />
      <div className="row">
        <div className="col-12 mb-3 scroll-container" style={{maxHeight: '70vh', overflowY: 'auto'}}>
          {messages.map((message, index) => (
            <div className="card mb-3" key={message.date.toString()}
                 ref={index === messages.length - 1 ? lastMessageRef : null}>
              <div className="card-body">
                <h5 className="card-title">{message.userName}</h5>
                <p className="card-text">{message.content}</p>
                <p className="card-text"><small className="text-muted">{message.date.toLocaleString()}</small></p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {user &&
        <>
          <hr/>
          <div className="row mt-3">
            <div className="col-12">
              <input type="text" className="form-control" placeholder="Message..." onKeyDown={e => {
                if (e.key === 'Enter') {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}/>
            </div>
          </div>
        </>

      }

    </div>
  )
}