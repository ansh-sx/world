// Import Supabase Library
const { createClient } = supabase;

// Supabase Credentials
const SUPABASE_URL = "https://pnmnimfdvbmoxuvbmayo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubW5pbWZkdmJtb3h1dmJtYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0MjY5MTgsImV4cCI6MjA0ODAwMjkxOH0.FBk1mlB3ZSaVfIWVc4zj5tzB7cHKyd0wDJxpDqvenX0";

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gradient Options
const gradients = [
    "linear-gradient(45deg, #ff9a9e, #fad0c4)",
    "linear-gradient(45deg, #a18cd1, #fbc2eb)",
    "linear-gradient(45deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(45deg, #fdcbf1, #e6dee9)",
    "linear-gradient(45deg, #fddb92, #d1fdff)"
];

// DOM Elements
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");
const registerBtn = document.getElementById("registerBtn");
const sendMessageBtn = document.getElementById("sendMessageBtn");

let currentUser = null;

// Register User
registerBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (!username) return alert("Enter a username!");

    const userGradient = gradients[Math.floor(Math.random() * gradients.length)];

    try {
        const { data, error } = await supabase.from("users").insert([{ username, gradient: userGradient }]);
        if (error) throw error;

        currentUser = { username, gradient: userGradient };
        alert(`Welcome ${username}! Gradient assigned.`);
        fetchMessages();
    } catch (error) {
        console.error(error.message);
        alert("Registration failed. Try another username.");
    }
});

// Send Message
sendMessageBtn.addEventListener("click", async () => {
    if (!currentUser) return alert("Register first!");

    const content = messageInput.value.trim();
    if (!content) return alert("Message cannot be empty!");

    try {
        const { error } = await supabase.from("messages").insert([
            { username: currentUser.username, user_gradient: currentUser.gradient, content }
        ]);
        if (error) throw error;

        messageInput.value = "";
        fetchMessages();
    } catch (error) {
        console.error(error.message);
        alert("Message sending failed!");
    }
});

// Fetch and Display Messages
async function fetchMessages() {
    try {
        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) throw error;

        renderMessages(messages);
    } catch (error) {
        console.error(error.message);
        alert("Failed to fetch messages!");
    }
}

// Render Messages in the Chat
function renderMessages(messages) {
    messagesContainer.innerHTML = "";
    messages.forEach(({ username, user_gradient, content }) => {
        const msg = document.createElement("div");
        msg.style.background = user_gradient;
        msg.className = "message";
        msg.innerHTML = `<strong>${username}:</strong> ${content}`;
        messagesContainer.appendChild(msg);
    });
}
