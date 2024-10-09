import { EventSection } from '@/containers/HomePage';
import { Flex } from 'antd';

export default function Home() {
    return (
        <Flex
            vertical
            className="h-full"
        >
            <EventSection />
        </Flex>
    );
}
