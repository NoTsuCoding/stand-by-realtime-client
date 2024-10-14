'use client';

import { Flex, Image } from 'antd';
import Title from 'antd/es/typography/Title';
import { MouseEventHandler } from 'react';

const BigButton: React.FC<{ title: string; onClick?: MouseEventHandler<HTMLElement>; disable?: boolean }> = ({
    title,
    onClick,
    disable = false,
}) => {
    const defaultButtonStyle = 'flex-1 w-full h-full rounded-xl border-[8px] border-eerie-black';
    const enableButtonStyle = ' cursor-pointer hover:bg-eerie-black';
    const disableButtonStyle = 'cursor-not-allowed bg-night';

    const disableTitleStyle = 'text-slate-400';
    const enableTitleStyle = 'text-white';

    return (
        <Flex
            justify="center"
            align="center"
            className={`${defaultButtonStyle} ${disable === true ? disableButtonStyle : enableButtonStyle}`}
            onClick={onClick}
        >
            <Title className={`${disable === true ? disableTitleStyle : enableTitleStyle}`}>{title}</Title>
        </Flex>
    );
};

export default BigButton;
