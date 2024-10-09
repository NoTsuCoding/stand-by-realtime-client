'use client';

import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import { MouseEventHandler } from 'react';

const BigButton: React.FC<{ title: string; onClick?: MouseEventHandler<HTMLElement> }> = ({ title, onClick }) => {
    return (
        <Flex
            justify="center"
            align="center"
            className="size-32 rounded-md border cursor-pointer"
            onClick={onClick}
        >
            <Title>{title}</Title>
        </Flex>
    );
};

export default BigButton;
