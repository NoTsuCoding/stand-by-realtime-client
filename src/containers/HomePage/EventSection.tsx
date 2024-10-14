'use client';

import BigButton from '@/components/BigButton';
import { EventContext } from '@/hooks/EventProvider/EventProvider';
import { standbyIO } from '@/socket';
import { Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const EventSection: React.FC = () => {
    const { getEventDetail, joinAsHost, joinAsParticipant, setHost } = useContext(EventContext);

    const [hostEnable, setHostEnable] = useState<boolean>(false);
    const [partEnable, setPartEnable] = useState<boolean>(false);

    const router = useRouter();

    const JoinAsHostBtnHandle = async () => {
        await joinAsHost();
        setHost(true);

        router.push('/room');
    };

    const JoinAsParticipantBtnHandle = async () => {
        await joinAsParticipant();
        setHost(false);

        router.push('/room');
    };

    const checkEventDetail = async () => {
        const eventDetail = await getEventDetail();
        if (eventDetail.isHostJoin) {
            setHostEnable(false);
            setPartEnable(true);
        } else {
            setHostEnable(true);
            setPartEnable(true);
        }
    };

    useEffect(() => {
        checkEventDetail();

        standbyIO.on('host_joined', checkEventDetail);
        standbyIO.on('host_left', checkEventDetail);
        standbyIO.on('participant_joined', checkEventDetail);
        standbyIO.on('participant_left', checkEventDetail);
        return () => {
            standbyIO.off('host_joined', checkEventDetail);
            standbyIO.off('host_left', checkEventDetail);
            standbyIO.off('participant_joined', checkEventDetail);
            standbyIO.off('participant_left', checkEventDetail);
        };
    }, []);

    return (
        <>
            <Flex className="flex-1 h-full items-center justify-center gap-6 p-6 sm:flex-col md:flex-row">
                <BigButton
                    title="จอแสดงผลหลัก"
                    disable={!hostEnable}
                    onClick={JoinAsHostBtnHandle}
                />

                <BigButton
                    title="ผู้เข้าร่วม"
                    disable={!partEnable}
                    onClick={JoinAsParticipantBtnHandle}
                />
            </Flex>
        </>
    );
};

export default EventSection;
