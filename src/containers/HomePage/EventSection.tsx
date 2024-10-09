'use client';

import BigButton from '@/components/BigButton';
import EventModal from '@/components/EventModal';
import { standbyIO } from '@/socket';
import { Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EventSection: React.FC = () => {
    const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);

    const router = useRouter();

    const onNewEvent = (data: { code: string }) => {
        router.push(`/room/${data.code}`);
    };

    useEffect(() => {
        standbyIO.on('new_event', onNewEvent);

        return () => {
            standbyIO.off('new_event', onNewEvent);
        };
    }, []);

    return (
        <>
            <EventModal
                open={eventModalOpen}
                onClose={() => setEventModalOpen(false)}
                onCancel={() => setEventModalOpen(false)}
                onOk={() => setEventModalOpen(false)}
            />

            <Flex className="flex-1 h-fullborder border-black ">
                <BigButton
                    title="Create"
                    onClick={() => {
                        setEventModalOpen(true);
                    }}
                />
                <BigButton title="Join" />
            </Flex>
        </>
    );
};

export default EventSection;
