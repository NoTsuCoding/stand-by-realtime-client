'use client';

import { EventContext } from '@/hooks/EventProvider/EventProvider';
import { standbyIO } from '@/socket';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

interface FieldType {
    eventName: string;
    participants: number;
}

const CreateEventModal: React.FC<{
    title?: React.ReactNode;
    open: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
}> = ({ title, open, onCancel, onOk, onClose }) => {
    const [eventForm] = useForm();

    const { createEvent } = useContext(EventContext);

    const router = useRouter();

    const eventFormSubmit = () => {
        eventForm.submit();
    };

    const onEventFormFinish: FormProps<FieldType>['onFinish'] = async values => {
        const eventData = await createEvent(values.eventName, values.participants);

        router.push(`/room/${eventData.code}`);
    };

    return (
        <Modal
            title={title || 'Create new event'}
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            onClose={onClose}
            footer={[
                <Button
                    key={'createEventBtn'}
                    onClick={eventFormSubmit}
                >
                    Create
                </Button>,
            ]}
        >
            <Form
                onFinish={onEventFormFinish}
                form={eventForm}
            >
                <Form.Item<FieldType>
                    label="event name"
                    name="eventName"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="number of participants"
                    name="participants"
                    rules={[{ required: true }]}
                >
                    <InputNumber controls={false} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateEventModal;
