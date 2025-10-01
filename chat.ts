// chat.ts
export async function startChat(ideaId: number, user1Id: number, user2Id: number) {
  const res = await fetch("http://localhost:8000/chat/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea_id: ideaId, user1_id: user1Id, user2_id: user2Id }),
  });
  return res.json();
}

export async function sendMessage(chatId: number, senderId: number, content: string) {
  const res = await fetch("http://localhost:8000/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, sender_id: senderId, content }),
  });
  return res.json();
}

export async function getMessages(chatId: number) {
  const res = await fetch(`http://localhost:8000/chat/${chatId}/messages`);
  return res.json();
}
