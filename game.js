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
    const choiceCounts = { delilah: 0, bethien: 0, thanhduy:0, thanhduysicrit: 0, kimanh: 0 };
    let userInteracted = false;

    document.addEventListener("click", () => {
        userInteracted = true;
    }, { once: true });

    function scrollToBottom() {
        setTimeout(() => {
            chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
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

    const style = document.createElement("style");
    style.textContent = `
        .chat-box {
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .chat-box::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(style);


    const messages = [
        { text: "*Valentine đến rùiiiii ~ Cùng FSL chơi một trò chơi nho nhỏ để tìm xem ai trong vũ trụ Thanh Duy sẽ là người thương của bạn dịp Lễ Tình nhân năm nay nhoaaaa ;\
*", sender: "bot" },
{ text: "Okie nghe hay á", sender: "user" },
        { text: "Ting ting. Hãy cùng chúng mình trả lời những câu hỏi sau để tìm ra đáp án cuối cùng nhó ^3^", sender: "bot", options: [
            { choice: "Mình sẵn sàng rồiiii"},
            { choice: "Để coai mấy người làm trò gì" },]
        },
        { 
            text: "Với bạn, thế nào là một tình yêu lý tưởng?", 
            sender: "bot", 
            options: [
                { choice: "Những rung động trong khoảnh khắc, đôi khi chỉ cần một ánh nhìn trìu mến ", images: ["thanhduy"] },
                { choice: "Lòng tôi bối rối chân tôi đứng ngồi không yên, lơ ngơ giống một tên điên say mê giấc mơ giấc mộng", images: ["kimanh"] },
                { choice: "Một bến đỗ bình yên, một người khiến mình cảm thấy an toàn và dễ chịu", images: ["bethien"]},
                { choice: "Là [tên người đó]", images: ["thanhduysicrit"] },
                { choice: "Những trải nghiệm thú vị, làm những điều mới mẻ, cùng nhau khám phá cuộc sống này ", images: ["delilah"] }
            ]
        },
        { 
            text: "Mô tả một buổi hẹn hò lý tưởng với bạn?", 
            sender: "bot", 
            options: [
                { choice: "Một buổi hẹn hò ấm cúng và thoải mái, cùng nhau nấu ăn, sau đó ôm nhau trên sofa cùng xem một bộ phim cả hai cùng thích", response: [{ text: "Nghe có vẻ ấm áp gheeeegheeee", sender: "bot" }], images: ["thanhduysicrit", "thanhduy"] },
                { choice: "Ngẫu hứng, không cần có kế hoạch trước, chỉ là làm những điều muốn làm cùng-với-nhau ", response: [
                    { text: "Dữ z shao", sender: "bot" },
                    { text: "Bất ngờ mới thú vị chớ", sender: "user" },
                    { text: "Ờ hớ", sender: "bot" }
                ], images: ["delilah", "thanhduy"] },
                { choice: "Nhẹ nhàng, tình cảm, sâu sắc, lúc cả hai có thể chia sẻ, tâm sự với nhau ", response: [{ text: "Healing~", sender: "bot" }], images: ["bethien"] },
                { choice: "Vô tư và vui nhộn, vibing trong từng khoảnh khắc ", response: [{ text: "Phải dui đúng không nè", sender: "bot" }], images: ["kimanh"] }
            ]
        },
        { 
            text: "Địa điểm hẹn hò bạn thích nhất?", 
            sender: "bot", 
            options: [
                { choice: "Công viên, đi dạo bờ hồ", images: ["bethien"] },
                { choice: "Đi xập xình quẩy nhạc disco", response: [{ text: "Quẩy nhiệt lênnn", sender: "bot" }], images: ["delilah"] },
                { choice: "Thủy cung, cùng nhau đi ngắm cá bơi", response: [{ text: "Glu glu glu", sender: "bot" }], images: ["thanhduy", "thanhduysicrit"] },
                { choice: "Đi karaoke hát 300 bài bolero", response: [{ text: "Kim Anh ơi dĩ dãng đaooooo thươnggggg", sender: "bot" }], images: ["kimanh"] }
            ]
        },
        { 
            text: "Bạn muốn đi đâu vào ngày hẹn hò đầu tiên?", 
            sender: "bot", 
            options: [
                { choice: "Ăn tối và đi cà phê ở nhà hàng có view thành phố", response: [{ text: "Sang choảnh hennnnnnn", sender: "bot" }], images: ["delilah"] },
                { choice: "Đi xem kịch hoặc đi show nhạc ngoài trời", response: [{ text: "Đi Sol 8 hay đi Mây hỏ", sender: "bot" }], images: ["kimanh","thanhduysicrit"] },
                { choice: "Đi công viên giải trí", response: [{ text: "Sẽ có cả bóng bay và kem nhỉ~", sender: "bot" }], images: ["bethien", "thanhduy"] },
                { choice: "Dạo biển và ngắm hoàng hôn", response: [{ text: "Woaaa, siêu lãng mạn", sender: "bot" }], images: ["thanhduy"] }
            ]
        },
        { 
            text: "Bạn sẽ mặc gì trong buổi hẹn hò với người ta?", 
            sender: "bot", 
            options: [
                { choice: "Không má nào chịu thua má nào, lộng lẫy lồng lộn nhất có thể", response: [{ text: "Slay and slay, she really loves to slay~", sender: "bot" }], images: ["delilah", "kimanh"] },
                { choice: "Thoải mái, dễ thương, năng động", response: [{ text: "Ayyyo!", sender: "bot" }], images: ["bethien"] },
                { choice: "Mở tủ ra thấy cái gì thì mặc cái đó", response: [{ text: "Như khui sícrit z", sender: "bot" }], images: ["kimanh"] },
                { choice: "Lựa chọn trang phục phù hợp với địa điểm hẹn hò", response: [{ text: "Thì ra là dị", sender: "bot" }], images: ["thanhduysicrit", "thanhduy"] },
            ]
        },
        { 
            text: "Bạn là ai trong một nhóm bạn?", 
            sender: "bot", 
            options: [
                { choice: "Người hoạt náo, luôn chủ động tổ chức mọi cuộc vui cho cả đám", response: [
                    { text: "Những người bạn như z cần được bảo tồn", sender: "bot" },
                    { text: "Chớ shaoooo", sender: "user" },
                ], images: ["delilah", "thanhduy"] },
                { choice: "Em bé, đáng iu, luôn được mọi người chiều chuộng", response: [{ text: "Ỏoooo", sender: "bot" }], images: ["bethien"] },
                { choice: "Người dễ tính trong cuộc sống và khó tính, nghiêm túc, chỉn chu trong công việc", images: ["thanhduysicrit"] },
                { choice: "Người vô tri, đầu óc bay trên mây trong những cuộc trò chuyện", response: [{ text: "HHò hó ho hò ho~", sender: "bot" }], images: ["kimanh"] }
            ]
        },
        { 
            text: "Một người như thế nào sẽ khiến bạn rung động?", 
            sender: "bot", 
            options: [
                { choice: "Một người dễ chịu, luôn sẵn sàng hùa theo những trò đùa của bạn", images: ["kimanh"] },
                { choice: "Một người tự do, can đảm, nhiệt thành", images: ["thanhduysicrit","thanhduy"] },
                { choice: "Một người nhẹ nhàng, luôn vui tươi và mang năng lượng tích cực", images: ["bethien"] },
                { choice: "Một người lúc nào cũng tỏa sáng trong lĩnh vực của họ", images: ["delilah"] }
            ]
        },
        {
            "text": "Bạn sẽ làm gì khi crush một người?",
            "sender": "bot",
            "options": [
                { 
                    "choice": "Tỏ tình luôn (dù người ta chối từ cũng hong quê đâu nha)", 
                    "response": [{ "text": "Trời ơi tự tin quá zậy!!!", "sender": "bot" }], 
                    "images": ["thanhduy"] 
                },
                { 
                    "choice": "Bật đèn xanh, thả thính nhẹ nhàng", 
                    "response": [{ "text": "Ủa là đang thả thính ai chưa nèeee~", "sender": "bot" }], 
                    "images": ["thanhduysicrit"] 
                },
                { 
                    "choice": "Thích nhưng tỏ ra sang chảnh, vờ như không để ý tới người ta", 
                    "response": [{ "text": "Làm giá ghê hông~~", "sender": "bot" }], 
                    "images": ["delilah"] 
                },
                { 
                    "choice": "Âm thầm quan tâm", 
                    "response": [{ "text": "Biết đâu người ta cũng để ý đóooo", "sender": "bot" }], 
                    "images": ["bethien"] 
                }
            ]
        },
        
        {   text: "Còn vài câu nữa thoiiiii", sender: "bot" },
        { 
            text: "Ngôn ngữ tình yêu của bạn là?", 
            sender: "bot", 
            options: [
                { choice: "Nói lời khẳng định, bày tỏ yêu thương", images: ["delilah", "thanhduysicrit"] },
                { choice: "Cử chỉ quan tâm", images: ["thanhduy", "bethien"] },
                { choice: "Tặng quà", images: ["bethien"] },
                { choice: "Ôm ấp, nắm tay, skinship", images: ["kimanh", "delilah"] },
                { choice: "Dành thời gian và sự chú tâm bên nhau", images: ["kimanh"] }
            ]
        },
        { 
            text: "Bạn sẽ mang quà gì cho người ấy trong một buổi hẹn hò?", 
            sender: "bot", 
            options: [
                { choice: "Bánh tráng/kẹo", images: ["bethien"] },
                { choice: "Bánh quy tự làm", images: ["thanhduy"] },
                { choice: "Trang phục/phụ kiện", images: ["delilah"] },
                { choice: "Một bó hoa nhỏ", images: ["kimanh"] },
                { choice: "Bất cứ thứ gì người ta cần/thích gần đây", images: ["thanhduysicrit"] }
            ]
        },
        { text: "Ukie câu hỏi cuối nè ^3^", sender: "bot" },
        { 
            text: "Bạn mong ước điều gì vào Valentine này?", 
            sender: "bot", 
            options: [
                { choice: "Một ngày tràn ngập tình yêuuuu", images: ["thanhduy"] },
                { choice: "Được tặng thật nhiều hoa và quà", images: ["bethien"] },
                { choice: "Một ngày được yêu chiều bản thân", images: ["delilah"] },
                { choice: "Ở bên cạnh người ấy là đủ", images: ["kimanh", "thanhduysicrit"] }
            ]
        },
        { text: "Hiểu gòi hiểu gòi nha, bây giờ bạn sẵn sàng xem kết quả chưa~", sender: "bot", options: [
            { choice: "Rùi nha"},
            { choice: "Từ từ khoan", response: [{ text: "Khum, ra kết quả luôn nè!", sender: "bot" }] },
        ] }
    ];
    
    function startConversation() {
        showMessage(messages[currentMessageIndex], () => {
            currentMessageIndex++;
            showNextMessage();
        });
    }

    startConversation();
});

