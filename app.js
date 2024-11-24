// Supabase Credentials
const SUPABASE_URL = "https://pnmnimfdvbmoxuvbmayo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubW5pbWZkdmJtb3h1dmJtYXlvIiwicm9sRSI6ImFub24iLCJpYXQiOjE3MzI0MjY5MTgsImV4cCI6MjA0ODAwMjkxOH0.FBk1mlB3ZSaVfIWVc4zj5tzB7cHKyd0wDJxpDqvenX0";

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gradient Options
const gradients = [
    "linear-gradient(45deg, #ff9a9e, #fad0c4)",
    "linear-gradient(45deg, #a18cd1, #fbc2eb)",
    "linear-gradient(45deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(45deg, #fdcbf1, #e6dee9)",
    "linear-gradient(45deg, #fddb92, #d1fdff)",
];

// Current User
let currentUser = null;

// DOM Elements
const registrationDiv = document.getElementById('registration');
const chatDiv = document.getElementById('chat');
const registerBtn = document.getElementById('registerBtn');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');

// Register User
registerBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    const userGradient = gradients[Math.floor(Math.random() * gradients.length)];

    try {
        // Save user to Supabase
        const { data, error } = await supabase.from('users').insert([
            { username, gradient: userGradient }
        ]);

        if (error) throw error;

        currentUser = { username, gradient: userGradient };

        registrationDiv.classList.add('hidden');
        chatDiv.classList.remove('hidden');
        alert(`Welcome, ${username}! Your gradient has been assigned.`);

        // Load previous messages
        fetchMessages();
    } catch (error) {
        console.error("Error registering user:", error.message);
        alert("Username might already exist. Please try a different one.");
    }
});

// Send Message
sendMessageBtn.addEventListener('click', async () => {
    const content = messageInput.value.trim();
    if (!content) {
        alert("Message cannot be empty!");
        return;
    }

    try {
        // Save message to Supabase
        const { error } = await supabase.from('messages').insert([
            {
                username: currentUser.username,
                user_gradient: currentUser.gradient,
                content,
            },
        ]);

        if (error) throw error;

        // Refresh messages
        fetchMessages();
        messageInput.value = '';
    } catch (error) {
        console.error("Error sending message:", error.message);
    }
});

// Fetch Messages
async function fetchMessages() {
    try {
        // Fetch messages from Supabase
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        renderMessages(messages);
    } catch (error) {
        console.error("Error fetching messages:", error.message);
    }
}

// Render Messages
function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach((msg) => {
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        messageEl.style.background = msg.user_gradient;
        messageEl.innerHTML = `<span class="username">${msg.username}:</span> ${msg.content}`;
        messagesContainer.appendChild(messageEl);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize the registration view
registrationDiv.classList.remove('hidden');
