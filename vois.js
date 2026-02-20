<script>
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const chat = document.getElementById('chat');

    function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
}

document.getElementById('voiceBtn').onclick = () => {
        speak("Hi! How can I help you today?");
    recognition.start();
};

recognition.onresult = (event) => {
  const userText = event.results[0][0].transcript;
    chat.innerHTML += `<p><strong>You:</strong> ${userText}</p>`;
    handleAI(userText);
};

    function handleAI(text) {
        let response = "Thanks for sharing. Please leave your name and phone number so we can contact you.";

    if (text.toLowerCase().includes("aggressive")) {
        response = "I understand. We help families work through aggressive behavior. Please leave your name and phone number, and we’ll reach out.";
  }

    chat.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
    speak(response);
}
</script>
