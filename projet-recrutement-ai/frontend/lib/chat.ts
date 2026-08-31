export interface Message {
  id: string;
  sender: "recruiter" | "candidate";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateTitle: string;
  candidateImage?: string;
  logo?: string;
  image?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}
