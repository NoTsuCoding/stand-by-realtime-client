'use client';

import { createContext, useEffect, useState } from 'react';
import { EventContextType } from './EventProvider.type';
import { standbyIO } from '@/socket';

export const EventContext = createContext<EventContextType>({} as EventContextType);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isReady, setReady] = useState<boolean>(false);

    const createEvent: EventContextType['createEvent'] = async (eventName, participants) => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('create_new_event', { eventName, participants }, (data: { code: string }) => {
                resolve(data);
            });
        });
    };

    const collapseEvent: EventContextType['collapseEvent'] = async eventCode => {
        standbyIO.emit('collapse_event', { eventCode });
    };

    const getEvent: EventContextType['getEvent'] = async eventCode => {
        return new Promise((resolve, reject) => {
            standbyIO.emit('get_event', { eventCode }, (data: { name: string; code: string } | { code: null }) => {
                if (!data.code) return reject('No room found.');

                resolve(data);
            });
        });
    };

    const joinEvent: EventContextType['joinEvent'] = async eventCode => {
        return new Promise((resolve, reject) => {
            standbyIO.emit(
                'join_event',
                { eventCode },
                (data: { isJoin: true } | { isJoin: false; reason: string }) => {
                    if (!data.isJoin) reject(data.reason);

                    resolve();
                }
            );
        });
    };

    const leaveEvent: EventContextType['leaveEvent'] = async eventCode => {
        return new Promise((resolve, reject) => {
            standbyIO.emit(
                'leave_event',
                { eventCode },
                (data: { isLeave: true } | { isLeave: false; reason: string }) => {
                    if (!data.isLeave) reject(data.reason);

                    resolve();
                }
            );
        });
    };

    const setState: EventContextType['setState'] = async (eventCode, state) => {
        return new Promise((resolve, reject) => {
            standbyIO.emit(
                'participant_state',
                { eventCode, state },
                (data: { isReady: true } | { isReady: false; reason: string }) => {
                    if (!data.isReady) reject(data.reason);

                    resolve();
                }
            );
        });
    };

    const onEventReady = ({ isReady }: { isReady: boolean }) => {
        return setReady(isReady);
    };

    useEffect(() => {
        standbyIO.connect();

        standbyIO.on('event_ready', onEventReady);

        return () => {
            standbyIO.off('event_ready', onEventReady);
            standbyIO.disconnect();
        };
    }, []);

    return (
        <EventContext.Provider
            value={{
                isReady,
                collapseEvent,
                leaveEvent,
                getEvent,
                joinEvent,
                createEvent,
                setState,
            }}
        >
            {children}
        </EventContext.Provider>
    );
};
