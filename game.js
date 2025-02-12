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

    const beepSound = new Audio('beep.mp3');
    const choiceCounts = { delilah: 0, bethien: 0, thanhduysicrit: 0, kimanh: 0 };
    let userInteracted = false;

    document.addEventListener("click", () => {
        userInteracted = true;
    }, { once: true });

    function scrollToBottom() {
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
    }

    function playBeep() {
        if (userInteracted) {
            beepSound.currentTime = 0;
            beepSound.play().catch(error => console.warn("Sound play blocked:", error));
        }
    }

    function showTypingIndicator(sender) {
        if (currentMessageIndex === 0) return null;
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("typing-indicator", sender === "bot" ? "bot-message" : "user-message");
        typingIndicator.textContent = "Typing...";
        const typingContainer = document.createElement("div");
        typingContainer.classList.add("message-container", sender === "bot" ? "bot-container" : "user-container");
        typingContainer.appendChild(typingIndicator);
        chatBox.appendChild(typingContainer);
        scrollToBottom();
        return typingContainer;
    }

    function showMessage(message, callback = null) {
        const delay = currentMessageIndex === 0 ? 0 : Math.min(3500, Math.max(1000, message.text.length * 50));
        const typingIndicator = currentMessageIndex === 0 ? null : showTypingIndicator(message.sender);
        setTimeout(() => {
            playBeep();
            if (typingIndicator) typingIndicator.remove();
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
        }, delay);
    }

    function showOptions(options) {
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("options");
        options.forEach(option => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.textContent = option.choice || option;
            button.onclick = () => handleChoice(option);
            optionsContainer.appendChild(button);
        });
        chatBox.appendChild(optionsContainer);
        scrollToBottom();
    }

    function handleChoice(option) {
        document.querySelectorAll(".option-btn").forEach(btn => btn.remove());
        showMessage({ text: option.choice, sender: "user" }, () => {
            if (option.response) {
                messages.splice(currentMessageIndex + 1, 0, ...option.response);
            }
            if (option.images) {
                option.images.forEach(imageName => {
                    if (choiceCounts[imageName] !== undefined) {
                        choiceCounts[imageName]++;
                    }
                });
            }
            currentMessageIndex++;
            showNextMessage();
        });
    }

    function determineFinalResult() {
        let maxCount = Math.max(...Object.values(choiceCounts));
        let topChoices = Object.keys(choiceCounts).filter(name => choiceCounts[name] === maxCount);
        let finalImage = topChoices[Math.floor(Math.random() * topChoices.length)];
        localStorage.setItem("resultImage", `images/${finalImage}.jpg`);
        window.location.href = "result.html";
    }

    let currentMessageIndex = 0;
    function showNextMessage() {
        if (currentMessageIndex >= messages.length) {
            determineFinalResult();
            return;
        }
        const message = messages[currentMessageIndex];
        showMessage(message, () => {
            if (message.options) {
                showOptions(message.options);
            } else {
                currentMessageIndex++;
                setTimeout(showNextMessage, 1000);
            }
        });
    }

    const messages = [
        { text: "*Bạn có một tin nhắn mới từ 'người bạn thân', bây giờ là tối ngày 13/2*", sender: "bot" },
        { text: "Hello emmmmm", sender: "bot" },
        { 
            text: "Em ăn gì chưa?", 
            sender: "bot", 
            options: [
                { choice: "Em chưaaaa", response: [
                    { text: "Ơ sao dị", sender: "bot" },
                    { text: "Em ăn gì anh mua cho nè", sender: "bot" },
                    { text: "Xíu nữa em ăn nèee", sender: "user" }
                ], images: ["bethien"] },
                { choice: "Em đi chơi chưa dề", response: [{ text: "Hừm...", sender: "bot" }], images: ["delilah","thanhduysicrit"] },
                { choice: "Dạ mới ăn rùi", response: [{ text: "Giỏi quá ta", sender: "bot" }], images: ["thanhduy"] },
                { choice: "Hỡi ơi cái nghĩa kim bằng mi chỉ đáng là trái cà thiu và một tô cơm hẩm", response: [{ text: "Há há há", sender: "bot" }], images: ["kimanh"] }
            ]
        },
        { 
            text: "Đang làm gì đó?", 
            sender: "bot", 
            options: [
                { choice: "Đang nghĩ về anh", response: [{ text: "Ui chùi ui", sender: "bot" }], images: ["delilah"] },
                { choice: "Đang nghe nhạc", response: [{ text: "Nghe KHÔNG QUÊ ĐÂU NHA phải hơm", sender: "bot" }], images: ["kimanh"] },
                { choice: "Đang ngủ gục trên bàn", response: [{ text: "Sao vậy bé, mệt quá hỏ?", sender: "bot" }], images: ["bethien","thanhduysicrit"] },
                { choice: "Chờ tin nhắn của anh nè", response: [{ text: "Ui chùi ui", sender: "bot" }], images: ["thanhduy"] }
            ]
        },
        { 
            text: "Mai em có rảnh không?", 
            sender: "bot", 
            options: [
                { choice: "Không anh", response: [
                    { text: "Ơ hu hu", sender: "bot" },
                    { text: "Em giỡn hoy, cóooo", sender: "user" },
                    { text: "Hớt hồn hà", sender: "bot" }
                ], images: ["delilah", "kimanh", "thanhduy"] },
                { choice: "Anh tính rủ em đi đâu ọ?", response: [{ text: "Ừaaaaa", sender: "bot" }], images: ["thanhduysicrit", "bethien"] },
                { choice: "Dạ tùy hì hì", response: [{ text: "Vậy là có nha!", sender: "bot" }], images: ["thanhduy"] },
                { choice: "Đố anh biết em đang nghĩ gìiiiiiiiii?", response: [{ text: "Lá la lá la la lá là~", sender: "bot" }], images: ["kimanh"] }
            ]
        },
        
        { 
            text: "Sáng mai em muốn đi đâu?", 
            sender: "bot", 
            options: [
                { choice: "Đi mua tóc giả", response: [{ text: "Dữ hơm", sender: "bot" }], images: ["delilah", "kimanh"] },
                { choice: "Đi cafe sáng", response: [{ text: "Okie luôn!", sender: "bot" }], images: ["thanhduysicrit"] },
                { choice: "Đi hát karaoke", response: [{ text: "Mới sáng mà sung dị?!", sender: "bot" }], images: ["kimanh", "bethien"] },
                { choice: "Đi dạo bờ hồ", response: [{ text: "Ỏ", sender: "bot" }], images: ["thanhduysicrit", "thanhduy"] },
                { choice: "Đi săn mây", response: [
                    { text: "Đây lên Đà Lạt 6 tiếng đó trời", sender: "bot" },
                    { text: "Đi thiệt không anh qua đón", sender: "bot" }
                ], images: ["bethien", "thanhduy"] }
            ]
        },
        { text: "Với cả", sender: "bot" },
        { 
            text: "Sau đó thì shao, em muốn đi đâu nữa nà?", 
            sender: "bot", 
            options: [
                { choice: "Đi Phú Quốc coi thủy cung", response: [{ text: "Anh cũng thích, let's gooo", sender: "bot" }], images: ["thanhduysicrit", "thanhduy"] },
                { choice: "Massage chữa lành đi anh", response: [
                    { text: "Ai, ai đã làm bé tổn thương???", sender: "bot" },
                    { text: "Em đau mỏi vai gáy", sender: "user" },
                    { text: "À...", sender: "bot" }
                ], images: ["delilah", "thanhduy"] },
                { choice: "Đi dạo", response: [{ text: "Dạo dạo quanh quanh nền cỏ xanh xanh~", sender: "bot" }], images: ["bethien"] },
                { choice: "Nhắn ai đi dề miền đất phương nam", response: [{ text: "Gừng xanh mây trắng soi dòng Cửu Long giangggg", sender: "bot" }], images: ["kimanh"] }
            ]
        },
            { text: "*Sau đây là một số câu hỏi, không phải từ người bạn ấy, nhưng là những điều bạn đang suy nghĩ*", sender: "bot" },
        { 
            text: "Love language của mình là gì nhỉ?", 
            sender: "bot", 
            options: [
                { choice: "Lời nói yêu thương", images: ["bethien", "thanhduysicrit"] },
                { choice: "Hành động chăm sóc", images: ["thanhduy", "kimanh"] },
                { choice: "Tặng quà", images: ["bethien"] },
                { choice: "Ôm ấp", images: ["kimanh", "delilah"] },
                { choice: "Dành thời gian chất lượng", images: ["all"] }
            ]
        },
        { 
            text: "Đối với bạn, tình yêu là gì?", 
            sender: "bot", 
            options: [
                { choice: "Một hành trình tìm kiếm", images: ["thanhduy"] },
                { choice: "Sự gắn bó", images: ["thanhduysicrit", "kimanh"] },
                { choice: "Tình bạn diệu kỳ", images: ["bethien"]},
                { choice: "Là Duy đó", images: ["delilah"] },
                { choice: "Chỉ cần 1 khoảnh khắc", images: ["delilah"] }
            ]
        },
        { 
            text: "Nếu bạn đang crush ai đó, bạn sẽ làm gì lúc này?", 
            sender: "bot", 
            options: [
                { choice: "Nếu đã thích anh rồi, em sẽ nói wo ai ni~~~", images: ["kimanh"] },
                { choice: "Nhìn trộm từ xa", images: ["bethien","thanhduy"] },
                { choice: "Thả thính nhẹ nhàng", images: ["thanhduysicrit"] },
                { choice: "Giả bộ không quan tâm nhưng thực ra quan tâm lắm", images: ["delilah"] }
            ]
        },
        { text: "Vậy nhaaaa, hẹn em ngày mai bình minh ló rạngg~", sender: "bot", options: [{ choice: "OK anh, ngủ ngon nhaaa" }] }
    ];
    
    function startConversation() {
        showMessage(messages[currentMessageIndex], () => {
            currentMessageIndex++;
            showNextMessage();
        });
    }

    startConversation();
});

