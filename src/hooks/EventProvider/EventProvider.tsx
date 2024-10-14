'use client';

import { createContext, useEffect, useState } from 'react';
import { EventContextType } from './EventProvider.type';
import { standbyIO } from '@/socket';
import { useRouter } from 'next/navigation';

export const EventContext = createContext<EventContextType>({} as EventContextType);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isReady, setReady] = useState<boolean>(false);
    const [isHost, setHost] = useState<boolean>(false);

    const joinAsHost: EventContextType['joinAsHost'] = async () => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('join_as_host', (data: { isJoin: true } | { isJoin: false; reason: string }) => {
                if (!data.isJoin) reject(data.reason);
                resolve();
            });
        });
    };

    const leaveAsHost: EventContextType['leaveAsHost'] = async () => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('leave_as_host', (data: { isLeave: true } | { isLeave: false; reason: string }) => {
                if (!data.isLeave) reject(data.reason);
                resolve();
            });
        });
    };

    const getEventDetail: EventContextType['getEventDetail'] = async () => {
        return new Promise((resolve, reject) => {
            standbyIO.emit(
                'event_detail',
                (data: {
                    isHostJoin: boolean;
                    currentParticipants: number;
                    participants: { role: 'host' | 'participant'; state: 'waiting' | 'ready' }[];
                }) => {
                    resolve(data);
                }
            );
        });
    };

    const joinAsParticipant: EventContextType['joinAsParticipant'] = async () => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('join_as_participant', (data: { isJoin: true } | { isJoin: false; reason: string }) => {
                if (!data.isJoin) reject(data.reason);
                resolve();
            });
        });
    };

    const leaveAsParticipant: EventContextType['leaveAsParticipant'] = async () => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('leave_as_participant', (data: { isLeave: true } | { isLeave: false; reason: string }) => {
                if (!data.isLeave) reject(data.reason);
                resolve();
            });
        });
    };

    const setParticipantState: EventContextType['setParticipantState'] = async (state: 'waiting' | 'ready') => {
        return new Promise((resolve, reject) => {
            standbyIO.emit(
                'participant_state',
                { state: state },
                (data: { isSet: true } | { isSet: false; reason: string }) => {
                    if (!data.isSet) reject(data.reason);

                    resolve();
                }
            );
        });
    };

    const isParticipant: EventContextType['isParticipant'] = async () => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('is_participant', (data: boolean) => {
                resolve(data);
            });
        });
    };

    const onEventState = ({ state }: { state: 'ready' | 'waiting' }) => {
        return setReady(state == 'ready');
    };

    useEffect(() => {
        standbyIO.connect();

        standbyIO.on('event_state', onEventState);

        return () => {
            standbyIO.off('event_state', onEventState);
            standbyIO.disconnect();
        };
    }, []);

    return (
        <EventContext.Provider
            value={{
                isReady,
                setHost,
                isHost,
                getEventDetail,
                joinAsHost,
                leaveAsHost,
                joinAsParticipant,
                leaveAsParticipant,
                setParticipantState,
                isParticipant,
            }}
        >
            {children}
        </EventContext.Provider>
    );
};
