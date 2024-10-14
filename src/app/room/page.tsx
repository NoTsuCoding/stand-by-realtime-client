'use client';

import { EventContext } from '@/hooks/EventProvider/EventProvider';
import { standbyIO } from '@/socket';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { MediaPlayer, MediaProvider } from '@vidstack/react';

export default function RoomPage() {
    const { isHost, leaveAsHost, leaveAsParticipant, isParticipant, getEventDetail, setParticipantState } =
        useContext(EventContext);

    const [participants, setParticipant] = useState<Awaited<ReturnType<typeof getEventDetail>>['participants']>([]);
    const [state, setState] = useState<'waiting' | 'ready'>('waiting');
    const [hostState, setHostState] = useState<'waiting' | 'ready'>('waiting');

    const [isPlay, setPlay] = useState<boolean>(false);

    const [timeleft, setTimeLeft] = useState<number>(0);

    const router = useRouter();

    const checkisParticipant = async () => {
        const response = await isParticipant();

        if (!response) {
            router.replace('/');
        }
    };

    const checkGetEventDetail = async () => {
        const eventDetail = await getEventDetail();

        setParticipant(eventDetail.participants);
        console.log(eventDetail);
    };

    const onHostLeft = () => {
        router.replace('/');
    };

    const cleanup = () => {
        if (isHost) {
            leaveAsHost();
        } else {
            leaveAsParticipant();
        }
    };

    const changeStateBtnHandle = async () => {
        const newState = state === 'ready' ? 'waiting' : 'ready';

        setState(newState);
        setParticipantState(newState);
    };

    const onEventStateChanged = ({ state }: { state: 'waiting' | 'ready' }) => {
        setHostState(state);
    };

    useEffect(() => {
        checkisParticipant();
        getEventDetail();
        checkGetEventDetail();

        standbyIO.on('host_left', onHostLeft);
        standbyIO.on('participant_left', checkGetEventDetail);
        standbyIO.on('participant_joined', checkGetEventDetail);
        standbyIO.on('participant_state_changed', checkGetEventDetail);
        standbyIO.on('event_state_changed', onEventStateChanged);

        window.addEventListener('beforeunload', cleanup);

        return () => {
            window.removeEventListener('beforeunload', cleanup);
            cleanup();
            standbyIO.off('host_left', onHostLeft);
            standbyIO.off('participant_left');
            standbyIO.off('event_state_changed', onEventStateChanged);
        };
    }, []);

    useEffect(() => {
        setTimeLeft(5);
        const playTimeout = setTimeout(() => {
            if (hostState === 'ready') {
                setPlay(true);
            }
        }, 6000);

        return () => {
            clearTimeout(playTimeout);
        };
    }, [hostState]);

    useEffect(() => {
        const timeLeftCountdown = setInterval(() => {
            setTimeLeft(timeleft - 1);
        }, 1000);

        return () => {
            clearInterval(timeLeftCountdown);
        };
    }, [timeleft, hostState]);

    return (
        <Flex className="h-full">
            {/* Audience */}
            {!isHost && (
                <>
                    {!isPlay && (
                        <Flex
                            className="border border-black w-full h-full"
                            onClick={changeStateBtnHandle}
                        >
                            {state === 'waiting' && (
                                <MediaPlayer
                                    src="/finger_scan.mp4"
                                    autoPlay
                                    loop
                                    controls={false}
                                >
                                    <MediaProvider />
                                </MediaPlayer>
                            )}
                            {state === 'ready' && (
                                <MediaPlayer
                                    src="/success_finger_scan.mp4"
                                    autoPlay
                                    loop
                                    controls={false}
                                >
                                    <MediaProvider />
                                </MediaPlayer>
                            )}
                        </Flex>
                    )}

                    {isPlay && (
                        <MediaPlayer
                            src="/opening.mp4"
                            autoPlay
                            controls={false}
                        >
                            <MediaProvider />
                        </MediaPlayer>
                    )}
                </>
            )}

            {/* Host */}
            {isHost && (
                <>
                    {!isPlay && (
                        <>
                            {participants.filter(x => x.role === 'participant').length === 0 && (
                                <Flex className="w-full h-full items-center justify-center">
                                    <Text className="text-platinum font-semibold text-5xl">กำลังรอผู้เข้าร่วม</Text>
                                </Flex>
                            )}

                            {participants.filter(x => x.role === 'participant').length !== 0 && (
                                <>
                                    {participants.filter(x => x.state === 'ready').length !==
                                        participants.filter(x => x.role === 'participant').length && (
                                        <Flex className="w-full h-full items-center justify-center">
                                            <Text className="text-platinum font-semibold text-9xl">
                                                พวกคุณพร้อมแล้วหรือยัง?
                                            </Text>
                                        </Flex>
                                    )}

                                    {participants.filter(x => x.state === 'ready').length ===
                                        participants.filter(x => x.role === 'participant').length && (
                                        <Flex className="w-full h-full items-center justify-center">
                                            <Text className="text-platinum font-semibold text-9xl">{timeleft}</Text>
                                        </Flex>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {isPlay && (
                        <>
                            <MediaPlayer
                                src="/opening.mp4"
                                autoPlay
                                controls={false}
                            >
                                <MediaProvider />
                            </MediaPlayer>
                        </>
                    )}
                </>
            )}
        </Flex>
    );
}
