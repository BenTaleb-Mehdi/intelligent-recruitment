export interface CandidateConversation {
  id: string;
  applicationId: string;
  recruiterName: string;
  companyName: string;
  role: string;
  avatar: string;
  recruiterImage?: string;
  logo?: string;
  image?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
  online?: boolean;
}

const STORAGE_KEY = "candidate_conversations";

export function getSavedCandidateConversations(): CandidateConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: CandidateConversation[] = JSON.parse(raw);

    // Only return conversations where a real message was sent/received
    return parsed.filter(
      (c) =>
        c.lastMessage &&
        c.lastMessage !== "Discussion démarrée" &&
        c.lastMessage !== "Aucun message envoyé"
    );
  } catch (e) {
    console.error("Error reading candidate conversations from localStorage:", e);
    return [];
  }
}

export function saveCandidateConversation(conv: Omit<CandidateConversation, "id"> & { id?: string }): CandidateConversation {
  const conversations = getSavedCandidateConversations();
  const id = conv.id || conv.applicationId;
  const avatar = conv.avatar || (conv.companyName || "RE").slice(0, 2).toUpperCase();

  const existingIndex = conversations.findIndex(
    (c) => c.applicationId === conv.applicationId || c.id === id
  );

  const updatedConv: CandidateConversation = {
    id,
    applicationId: conv.applicationId,
    recruiterName: conv.recruiterName || `Recruteur (${conv.companyName || "Entreprise"})`,
    companyName: conv.companyName || "Entreprise",
    role: conv.role || "Poste recommandé",
    avatar,
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
      console.error("Error saving candidate conversation to localStorage:", e);
    }
  }

  return updatedConv;
}
