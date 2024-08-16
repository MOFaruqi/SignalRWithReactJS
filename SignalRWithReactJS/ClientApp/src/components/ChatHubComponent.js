import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7168/chathub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR!');

                    connection.on('ReceiveMessage', (user, message) => {
                        setMessages(messages => [...messages, { user, message }]);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async () => {
        //console.log("I Am In sendMessage:",connection._connectionStarted);
        if (connection._connectionStarted) {
            try {
                await connection.send('SendMessage', user, message);
                setMessage(''); // Clear the message input after sending
            } catch (err) {
                console.error('Sending message failed: ', err);
            }
        } else {
            alert("No connection to the server yet.");
        }
    };

    return (
        <div>
            <h2>Chat Application</h2>
            <div>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter your message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <ul>
                {messages.map((m, index) => (
                    <li key={index}><strong>{m.user}</strong>: {m.message}</li>
                ))}
            </ul>
        </div>
    );
};