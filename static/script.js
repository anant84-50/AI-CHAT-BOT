const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const chatArea = document.getElementById("chatArea");
const toast = document.getElementById("toast");
const historyKey = "novachat_history_v1";

let chat = JSON.parse(localStorage.getItem(historyKey) || "[]");

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);
}

function escapeHTML(text){
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

function renderSaved(){
  messages.innerHTML = "";
  if(chat.length){
    welcome.style.display = "none";
    chat.forEach(m => addMessage(m.role,m.text,false));
  } else {
    welcome.style.display = "block";
  }
}

function addMessage(role,text,save=true){
  welcome.style.display = "none";
  const row = document.createElement("div");
  row.className = `message-row ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = role === "user" ? "AS" : "✦";
  const body = document.createElement("div");
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = escapeHTML(text);
  body.appendChild(bubble);

  if(role === "assistant"){
    const actions = document.createElement("div");
    actions.className = "bubble-actions";
    const copy = document.createElement("button");
    copy.textContent = "Copy";
    copy.onclick = () => navigator.clipboard?.writeText(text).then(()=>showToast("Copied to clipboard"));
    actions.appendChild(copy);
    body.appendChild(actions);
  }
  row.appendChild(avatar); row.appendChild(body); messages.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;

  if(save){
    chat.push({role,text});
    localStorage.setItem(historyKey,JSON.stringify(chat));
  }
}

function addTyping(){
  const row=document.createElement("div");
  row.className="message-row assistant"; row.id="typingRow";
  row.innerHTML='<div class="msg-avatar">✦</div><div><div class="bubble"><div class="typing"><i></i><i></i><i></i></div></div></div>';
  messages.appendChild(row); chatArea.scrollTop=chatArea.scrollHeight;
}
function removeTyping(){document.getElementById("typingRow")?.remove()}

async function sendMessage(text){
  text=(text ?? input.value).trim();
  if(!text || sendBtn.disabled) return;
  input.value=""; autoResize();
  addMessage("user",text);
  addTyping();
  sendBtn.disabled=true;
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});
    const data=await res.json();
    removeTyping();
    if(!res.ok) throw new Error(data.error || "Something went wrong");
    addMessage("assistant",data.reply);
  }catch(err){
    removeTyping();
    addMessage("assistant","Sorry, I couldn't process that message. Please try again.");
    showToast("Backend connection error");
  }finally{sendBtn.disabled=false;input.focus()}
}

function autoResize(){
  input.style.height="auto";
  input.style.height=Math.min(input.scrollHeight,130)+"px";
}
input.addEventListener("input",()=>{autoResize();sendBtn.disabled=!input.value.trim()});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage()}});
sendBtn.addEventListener("click",()=>sendMessage());

document.querySelectorAll("[data-prompt]").forEach(btn=>btn.addEventListener("click",()=>sendMessage(btn.dataset.prompt)));

document.getElementById("newChatBtn").onclick=()=>{
  chat=[]; localStorage.removeItem(historyKey); renderSaved(); input.focus(); showToast("New chat started");
};
document.getElementById("clearHistoryBtn").onclick=()=>{
  chat=[]; localStorage.removeItem(historyKey); renderSaved(); showToast("Chat history cleared");
};
document.getElementById("historyBtn").onclick=()=>showToast(chat.length ? `${chat.length} messages saved in this browser` : "No saved messages yet");

const themeKey="novachat_theme";
function applyTheme(){
  document.body.classList.toggle("dark",localStorage.getItem(themeKey)==="dark");
  document.getElementById("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
}
document.getElementById("themeBtn").onclick=()=>{
  localStorage.setItem(themeKey,document.body.classList.contains("dark")?"light":"dark"); applyTheme();
};

document.getElementById("attachBtn").onclick=()=>showToast("Attachment support is a demo feature");
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");

let recognition;
const mic=document.getElementById("micBtn");
if("webkitSpeechRecognition" in window || "SpeechRecognition" in window){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  recognition=new SpeechRecognition();
  recognition.lang="en-IN"; recognition.interimResults=false;
  recognition.onresult=e=>{input.value=e.results[0][0].transcript;autoResize();sendBtn.disabled=false};
  recognition.onerror=()=>showToast("Voice input unavailable");
  mic.onclick=()=>{try{recognition.start();showToast("Listening...")}catch{}};
}else{
  mic.onclick=()=>showToast("Voice input is not supported in this browser");
}

applyTheme(); renderSaved(); autoResize(); sendBtn.disabled=!input.value.trim();
