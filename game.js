document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("chat-container");
    document.body.appendChild(chatContainer);

    const chatHeader = document.createElement("div");
    chatHeader.classList.add("chat-header");
    chatHeader.textContent = "BẠN TRAI GIẢ GIẢ CỦA EM";
    chatContainer.appendChild(chatHeader);

    const chatBox = document.createElement("div");
    chatBox.id = "chat-box";
    chatBox.classList.add("chat-box");
    chatContainer.appendChild(chatBox);

    const messages = [
        { text: "*Hôm nay là ngày 13/2, bạn có một tin nhắn mới từ anh bạn trai. Anh ấy sẽ có kế hoạch gì cho ngày mai nhỉ?*", sender: "bot" },
        { text: "Chào buổi sánggggg! Chúc em có một ngày thật vui nha!", sender: "bot" },
        { 
            text: "Em biết ngày mai là ngày gì hơm?", 
            sender: "bot", 
            options: ["Ngày gì dạ anh?", "Ngày mình chung đôi đúng không ạ", "Ngày hôm nay ta cùng họp hoan nơi đây", "...(Seen)"] 
        },
        { 
            text: "Không giờ rồi em ngủ chưa em, sao em còn thao thức em ơi?", 
            sender: "bot",
            options: ["Tại em thích", "1 2 3 con chim ri", "chưa mua nhạc itunes thì đi mua đi"] 
        },
        { 
            text: "Nốt câu này nữa thôi, sáng mai ăn gì em", 
            sender: "bot",
            options: ["Bánh bò nước sâm", "Súp cua", "140 phần teabreak", "Ăn chay niệm phật"] 
        },
        { 
            text: "Rồi h coi kết quả nè, mà anh mới làm có 1 route à, đại đi", 
            sender: "bot",
            options: ["OK anh"]
        }
    ];

    let currentMessageIndex = 0;

    function scrollToBottom() {
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
    }

    function showMessage(message, callback = null) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container", message.sender === "bot" ? "bot-container" : "user-container");

        const avatar = document.createElement("img");
        avatar.src = message.sender === "bot" ? "images/sender_ava.jpg" : "images/your_ava.png";
        avatar.classList.add("avatar");

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", message.sender === "bot" ? "bot-message" : "user-message");
        messageDiv.textContent = message.text;

        if (message.sender === "bot") {
            messageContainer.appendChild(avatar);
            messageContainer.appendChild(messageDiv);
        } else {
            messageContainer.appendChild(messageDiv);
            messageContainer.appendChild(avatar);
        }

        chatBox.appendChild(messageContainer);
        scrollToBottom();

        if (callback) {
            setTimeout(callback, 1000);
        }
    }

    function showOptions(options) {
        if (!options) return;
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("options");

        options.forEach(option => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.textContent = option;
            button.onclick = () => handleChoice(option);
            optionsContainer.appendChild(button);
        });

        chatBox.appendChild(optionsContainer);
        scrollToBottom();
    }

    function handleChoice(choice) {
        document.querySelectorAll(".option-btn").forEach(btn => btn.remove());
        showMessage({ text: choice, sender: "user" }, () => {
            currentMessageIndex++;
            if (currentMessageIndex < messages.length) {
                showNextMessage();
            } else {
                setTimeout(() => {
                    window.location.href = "result.html";
                }, 1500);
            }
        });
    }

    function showNextMessage() {
        if (currentMessageIndex >= messages.length) return;
        const message = messages[currentMessageIndex];
        showMessage(message, () => {
            if (message.options) {
                showOptions(message.options);
            } else {
                currentMessageIndex++;
                setTimeout(showNextMessage, 1500);
            }
        });
    }

    function startConversation() {
        showNextMessage();
    }

    startConversation();
});
