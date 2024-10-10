export interface EventContextType {
    isReady: boolean;
    createEvent: (eventName: string, participants: number) => Promise<{ code: string }>;
    getEvent: (eventCode: string) => Promise<{ name: string; code: string }>;
    collapseEvent: (eventCode: string) => Promise<void>;
    joinEvent: (eventCode: string) => Promise<void>;
    leaveEvent: (eventCode: string) => Promise<void>;
    setState: (eventCode: string, state: 'waitng' | 'ready') => Promise<void>;
}
