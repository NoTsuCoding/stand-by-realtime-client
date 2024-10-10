'use client';

import BigButton from '@/components/BigButton';
import CreateEventModal from '@/components/CreateEventModal';
import JoinEventModal from '@/components/JoinEventModal';
import { Flex } from 'antd';
import { useState } from 'react';

const EventSection: React.FC = () => {
    const [eventCreateModalOpen, setEventCreateModalOpen] = useState<boolean>(false);
    const [eventJoinModalOpen, setEventJoinModalOpen] = useState<boolean>(false);

    return (
        <>
            <CreateEventModal
                open={eventCreateModalOpen}
                onClose={() => setEventCreateModalOpen(false)}
                onCancel={() => setEventCreateModalOpen(false)}
                onOk={() => setEventCreateModalOpen(false)}
            />

            <JoinEventModal
                open={eventJoinModalOpen}
                onClose={() => setEventJoinModalOpen(false)}
                onCancel={() => setEventJoinModalOpen(false)}
                onOk={() => setEventJoinModalOpen(false)}
            />

            <Flex className="flex-1 h-fullborder border-black ">
                <BigButton
                    title="Create"
                    onClick={() => {
                        setEventCreateModalOpen(true);
                    }}
                />
                <BigButton
                    title="Join"
                    onClick={() => {
                        setEventJoinModalOpen(true);
                    }}
                />
            </Flex>
        </>
    );
};

export default EventSection;
