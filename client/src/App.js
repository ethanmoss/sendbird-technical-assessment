import React, { useEffect, useState } from "react";
import {App as SendbirdApp } from 'sendbird-uikit';
import "sendbird-uikit/dist/index.css";

const APP_ID = "B7022D21-EB4B-4F1E-B30F-BD54620DA255";
const USER_ID = "trey_anastasio";

export default function App() {

    const [ listening, setListening ] = useState(false)

    useEffect(() => {
        if (!listening) {
            // Setup new EventSource listener for Server-Sent Events
            const notif = new EventSource('http://localhost:3000/notify')
            let profanity;

            notif.addEventListener("message", event => {
                let eventData = isValidJSON(event.data)
                
                //Error check for 
                if(typeof profanity === 'undefined' || profanity.time != eventData.time && eventData != false) {
                    profanity = eventData
                    notifyProfanity(profanity)
                }

            })
            setListening(true)
        }
    }, [listening])

    function isValidJSON(str) {
        try {
            return JSON.parse(str)
        } catch {
            return false
        }
    }

    function notifyProfanity(message) {

        let notif = "Profane message alert from: " + message.sender;

        // Check if browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        // Check if notification permissions are already granted
        else if (Notification.permission === "granted") {
            new Notification(notif);
        }
        // Ask user for permission to send notification
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(notif);
                }
            });
        }
    }

    return (
        <div className="App">
            <SendbirdApp appId={APP_ID} userId={USER_ID} />
        </div>
    )
}
