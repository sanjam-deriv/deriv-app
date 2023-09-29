import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import CheckmarkCircle from '../../public/images/checkmark-circle.svg';
import Clipboard from '../../public/images/clipboard.svg';
import './WalletClipboard.scss';

type TProps = {
    infoMessage?: string;
    popoverAlignment: 'bottom' | 'left' | 'right' | 'top';
    successMessage: string;
    textCopy: string;
};

const WalletClipboard = ({
    //  info_message, popoverAlignment, success_message,
    textCopy,
}: TProps) => {
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
    let timeoutClipboard: ReturnType<typeof setTimeout>;

    const onClick = (event: { stopPropagation: () => void }) => {
        setIsCopied(true);
        copy(textCopy);
        timeoutClipboard = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    useEffect(() => {
        return () => clearTimeout(timeoutClipboard);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <button className='wallets-clipboard' onClick={onClick}>
            {isCopied ? <CheckmarkCircle /> : <Clipboard />}
        </button>
    );
};

export default WalletClipboard;
