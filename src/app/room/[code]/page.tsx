'use client';

import { EventContext } from '@/hooks/EventProvider/EventProvider';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function RoomPage({ params }: { params: { code: string } }) {
    const { collapseEvent, getEvent } = useContext(EventContext);
    const eventCode = params.code;

    const router = useRouter();

    const checkIsExisted = async (eventCode: string) => {
        try {
            const eventData = await getEvent(eventCode);
            console.log(eventData);
        } catch (err) {
            console.log(err);
            // return router.replace('/');
        }
    };

    useEffect(() => {
        checkIsExisted(eventCode);

        return () => {
            console.log('test');
            // TODO: Bug unmount
            // collapseEvent(eventCode);
        };
    }, []);

    return <>test {params.code}</>;
}
