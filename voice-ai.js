document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       SPEECH RECOGNITION
    ========================= */

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;
    }

    /* =========================
       ELEMENTS
    ========================= */

    const chat = document.getElementById("chat");
    const chatWidget = document.getElementById("chat-widget");
    const btn = document.getElementById("voiceBtn");
    const closeBtn = document.getElementById("close-chat-btn");

    if (!btn || !chat) {
        console.error("Missing required elements");
        return;
    }

    /* =========================
       BUTTON UI
    ========================= */

    btn.innerHTML = `
        <img src="assets/images/grok-video-51f047fb-90ae-435d-94a5-96b3ebbfd7bb-(1).gif"
             style="width:100%;height:100%;object-fit:cover;">
        <span class="btn-text">Talk to me<br>I am DogBot</span>
    `;

    /* =========================
       AUDIO FILES
    ========================= */

    const greetingAudio = new Audio("assets/audio/dog-bot.wav");
    const answerAudio = new Audio("assets/audio/dog-answer.wav");

    greetingAudio.preload = "auto";
    answerAudio.preload = "auto";

    function playAudio(audio, callback) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error(err));
        audio.onended = () => {
            if (callback) callback();
        };
    }

    function stopAudio() {
        greetingAudio.pause();
        greetingAudio.currentTime = 0;
        greetingAudio.onended = null;
        answerAudio.pause();
        answerAudio.currentTime = 0;
        answerAudio.onended = null;
    }

    /* =========================
       STATE
    ========================= */

    let isChatOpen = false;
    let isListening = false;
    let hasGreeted = false;

    /* =========================
       UI HELPERS
    ========================= */

    function addMessage(sender, text) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chat.appendChild(p);
        chat.scrollTop = chat.scrollHeight;
    }

    function toggleChat(show) {
        isChatOpen = show;
        if (chatWidget) {
            chatWidget.style.display = show ? "flex" : "none";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            toggleChat(false);
            if (recognition) recognition.stop();
            isListening = false;
            hasGreeted = false;
            stopAudio();
        };
    }

    /* =========================
       LISTEN
    ========================= */

    function startListening() {
        if (!recognition || isListening) return;
        isListening = true;
        try {
            recognition.start();
        } catch (e) {
            isListening = false;
        }
    }

    /* =========================
       CLICK FLOW
    ========================= */
    let firstTime = true;
    btn.onclick = () => {
        toggleChat(true);

        if (!hasGreeted) {
            hasGreeted = true;
            if (firstTime == true) {

                addMessage(
                    "AI",
                    "Woof,woof! Hello, I'm your robot assistant, and I'm listening to you very carefully. Please tell me how I can help you today."
                );
                firstTime = false;
            }

            // ▶️ СНАЧАЛА приветствие, ПОТОМ слушаем
            playAudio(greetingAudio, startListening);
        }
    };

    /* =========================
       AFTER USER FINISHES SPEAKING
    ========================= */

    if (recognition) {
        recognition.onresult = (event) => {
            isListening = false;

            const userText = event.results[0][0].transcript;
            addMessage("You", userText);

            addMessage(
                "AI",
                "Thank you for your question! Our managers will answer all your questions very soon.You can contact Voskan at 818-357-3797, or Simon at 424-424-6444. Woof!"
            );

            // ▶️ ОТВЕТ ТОЛЬКО ПОСЛЕ ОКОНЧАНИЯ ВОПРОСА
            playAudio(answerAudio);
        };

        recognition.onend = () => {
            isListening = false;
        };

        recognition.onerror = () => {
            isListening = false;
        };
    }
});