export interface EventContextType {
    isReady: boolean;
    isHost: boolean;
    getEventDetail: () => Promise<{
        isHostJoin: boolean;
        currentParticipants: number;
        participants: {
            role: 'host' | 'participant';
            state: 'ready' | 'waiting';
        }[];
    }>;
    joinAsHost: () => Promise<void>;
    leaveAsHost: () => Promise<void>;
    joinAsParticipant: () => Promise<void>;
    leaveAsParticipant: () => Promise<void>;
    setParticipantState: (state: 'waiting' | 'ready') => Promise<void>;
    setHost: (ishost: boolean) => void;
    isParticipant: () => Promise<boolean>;
}
