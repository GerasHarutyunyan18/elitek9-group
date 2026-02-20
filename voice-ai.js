document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       BASIC SETUP
    ========================= */

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    // Check browser support
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;
    } else {
        console.warn("Speech Recognition API not supported in this browser.");
    }

    const chat = document.getElementById("chat");
    const chatWidget = document.getElementById("chat-widget");
    const btn = document.getElementById("voiceBtn");
    const closeBtn = document.getElementById("close-chat-btn");

    if (!btn || !chat) return; // Exit if elements not found

    // Replace microphone icon with dog image
    btn.innerHTML = '<img src="assets/images/grok-video-51f047fb-90ae-435d-94a5-96b3ebbfd7bb-(1).gif" alt="AI Dog" style="width: 100%; height: 100%; object-fit: cover;">';

    let turnCount = 0;
    let isListening = false;
    let isChatOpen = false;

    /* =========================
       SPEAK FUNCTION
    ========================= */

    function speak(text, onEndCallback) {
        if (!window.speechSynthesis) return;

        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "en-US";
        msg.rate = 1;
        msg.pitch = 1;

        msg.onend = () => {
            if (onEndCallback) onEndCallback();
        };

        window.speechSynthesis.cancel(); // important
        window.speechSynthesis.speak(msg);
    }

    /* =========================
       TIME CHECK
    ========================= */

    function isAfterHours() {
        const now = new Date();
        const hour = now.getHours();
        return hour < 9 || hour >= 18;
    }

    /* =========================
       UI HELPERS
    ========================= */

    function addMessage(sender, text) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chat.appendChild(p);
        chat.scrollTop = chat.scrollHeight;
    }

    function toggleChat(show) {
        isChatOpen = show;
        if (chatWidget) {
            chatWidget.style.display = show ? 'flex' : 'none';
        } else {
            chat.style.display = show ? 'flex' : 'none';
        }
        chat.scrollTop = chat.scrollHeight;
    }

    // Close button logic
    if (closeBtn) {
        closeBtn.onclick = () => {
            toggleChat(false);
            if (recognition) recognition.stop();
            window.speechSynthesis.cancel();
            isListening = false;
            btn.classList.remove('listening');
        };
    }

    /* =========================
       INTENT DETECTION
    ========================= */

    function detectIntent(text) {
        text = text.toLowerCase();

        if (text.match(/aggressive|aggression|bite|biting|growl|reactive|attack/)) {
            return "aggression";
        }

        if (text.match(/price|cost|how much|pricing/)) {
            return "pricing";
        }

        if (text.match(/how do you|method|approach|train/)) {
            return "method";
        }

        if (text.match(/kids|children|family|safe|home/)) {
            return "family";
        }

        if (text.match(/online|in person|at home|location/)) {
            return "location";
        }

        return "unknown";
    }

    /* =========================
       AI RESPONSE LOGIC
    ========================= */

    function getAIResponse(userText) {
        turnCount++;
        const intent = detectIntent(userText);

        if (isAfterHours()) {
            return "Thanks for reaching out. We’re currently closed, but I can help you get started. Please leave your name and phone number, and we’ll contact you as soon as we’re open.";
        }

        switch (intent) {
            case "aggression":
                return "I understand. Aggressive behavior can be very stressful for families. When does this usually happen — at home, on walks, or around new people?";

            case "pricing":
                return "Pricing depends on your dog’s needs. We start with a free consultation. Would you like us to contact you to go over the details?";

            case "method":
                return "We focus on clear communication, structure, and consistency. Every dog and family is different.";

            case "family":
                return "Safety at home is always the priority. We help families create calm, reliable behavior.";

            case "location":
                return "That’s something we can discuss during a free consultation.";

            default:
                if (turnCount >= 3) {
                    return "If you’d like, you can leave your name and phone number, and we’ll contact you to discuss the next steps.";
                }
                return "Thanks for sharing. Can you tell me a bit more?";
        }
    }

    /* =========================
       LISTEN FUNCTION
    ========================= */

    function startListening() {
        if (isListening || !recognition) return;
        isListening = true;
        try {
            recognition.start();
            btn.classList.add('listening'); // Optional visual cue
        } catch (e) {
            console.error(e);
            isListening = false;
        }
    }

    /* =========================
       VOICE FLOW
    ========================= */

    btn.onclick = () => {
        // Toggle chat visibility if it's not open, or just ensure it's open
        if (!isChatOpen) {
            toggleChat(true);

            // Only start greeting if chat was empty (first time)
            if (chat.children.length === 0) {
                const greeting = "Hi! You can speak freely. Tell me what’s going on with your dog.";
                addMessage("AI", greeting);
                speak(greeting, startListening);
            } else {
                // If opening again, maybe just listen?
                // Or let user decide to speak.
                // Let's prompt listening.
                startListening();
            }
        } else {
            // If already open, clicking button keeps it open and listens
            speak("I'm listening.", startListening);
        }
    };

    if (recognition) {
        recognition.onresult = (event) => {
            isListening = false;
            btn.classList.remove('listening');

            const userText = event.results[0][0].transcript;
            addMessage("You", userText);

            const response = getAIResponse(userText);
            addMessage("AI", response);

            speak(response, startListening);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error", event.error);
            isListening = false;
            btn.classList.remove('listening');
            // Don't auto-speak error to avoid loops, unless specific error
            if (event.error === 'no-speech') {
                // speak("I didn't hear anything.", startListening);
            }
        };

        recognition.onend = () => {
            isListening = false;
            btn.classList.remove('listening');
        };
    } else {
        btn.onclick = () => {
            alert("Voice recognition not supported in this browser. Please try Chrome.");
        }
    }
});
