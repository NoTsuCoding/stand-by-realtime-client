import { EventContext } from '@/hooks/EventProvider/EventProvider';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

interface FieldType {
    eventCode: string;
}

const JoinEventModal: React.FC<{
    title?: React.ReactNode;
    open: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
}> = ({ title, open, onCancel, onOk, onClose }) => {
    const [eventForm] = useForm();

    const { joinEvent } = useContext(EventContext);

    const eventFormSubmit = () => {
        eventForm.submit();
    };

    const router = useRouter();

    const onEventFormFinish: FormProps<FieldType>['onFinish'] = async values => {
        try {
            await joinEvent(values.eventCode);
        } catch (err) {
            return;
        }

        return router.push(`/room/${values.eventCode}/participate`);
    };

    return (
        <Modal
            title={title || 'Join event'}
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            onClose={onClose}
            footer={[
                <Button
                    key={'createEventBtn'}
                    onClick={eventFormSubmit}
                >
                    Join
                </Button>,
            ]}
        >
            <Form
                onFinish={onEventFormFinish}
                form={eventForm}
            >
                <Form.Item<FieldType>
                    label="event code"
                    name="eventCode"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default JoinEventModal;
