export interface RecruiterConversation {
  id: string;
  applicationId?: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateTitle: string;
  candidateImage?: string;
  logo?: string;
  image?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
  online?: boolean;
}

export interface SaveRecruiterConversationParams {
  id?: string;
  applicationId?: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateTitle?: string;
  candidateImage?: string;
  logo?: string;
  image?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
  online?: boolean;
}

const STORAGE_KEY = "recruiter_conversations";

export function getSavedRecruiterConversations(): RecruiterConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: RecruiterConversation[] = JSON.parse(raw);

    // Only return conversations where a real message was sent/received
    return parsed.filter(
      (c) =>
        c.lastMessage &&
        c.lastMessage !== "Discussion démarrée" &&
        c.lastMessage !== "Aucun message envoyé"
    );
  } catch (e) {
    console.error("Error reading recruiter conversations from localStorage:", e);
    return [];
  }
}

export function saveRecruiterConversation(conv: SaveRecruiterConversationParams): RecruiterConversation {
  const conversations = getSavedRecruiterConversations();
  const id = conv.id || conv.candidateId || Math.random().toString(36).substring(2, 10);
  const avatar =
    conv.candidateAvatar ||
    (conv.candidateName || "CA")
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const existingIndex = conversations.findIndex(
    (c) => c.candidateId === conv.candidateId || c.id === id
  );

  const updatedConv: RecruiterConversation = {
    id,
    candidateId: conv.candidateId || id,
    candidateName: conv.candidateName || "Candidat",
    candidateAvatar: avatar,
    candidateTitle: conv.candidateTitle || "Candidat Postulant",
    lastMessage: conv.lastMessage,
    lastTime: conv.lastTime || "Aujourd'hui",
    unread: conv.unread || 0,
    online: conv.online !== undefined ? conv.online : true,
  };

  // Only persist to localStorage if a real message text is provided
  if (
    conv.lastMessage &&
    conv.lastMessage !== "Discussion démarrée" &&
    conv.lastMessage !== "Aucun message envoyé"
  ) {
    if (existingIndex >= 0) {
      conversations[existingIndex] = {
        ...conversations[existingIndex],
        ...updatedConv,
      };
    } else {
      conversations.unshift(updatedConv);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error("Error saving recruiter conversation to localStorage:", e);
    }
  }

  return updatedConv;
}
