import { useEffect, useState, useRef } from "react";

export function useProfileViewLogic(profile: any) {
    const [blockSelected, setBlockSelected] = useState<string>('profile');
    const [haveImage, setHaveImage] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const hash = window.location.hash.replace('#','');
        if (hash === 'suscripciones') setBlockSelected('subscriptions');
        else if (hash === 'guardados') setBlockSelected('mySaves');
        else if (hash === 'estadisticas') setBlockSelected('Analytics');
        else if (hash === 'terminos') setBlockSelected('terms');
    }, []);

    useEffect(() => {
        if (profile?.image?.endsWith("/none") === false) setHaveImage(true);
        else setHaveImage(false);
    }, [profile]);

    const handleSelectBlock = (block: string) => {
        setBlockSelected(block);
        let newHash: string;
        switch (block) {
            case 'subscriptions': newHash = 'suscripciones'; break;
            case 'mySaves': newHash = 'guardados'; break;
            case 'Analytics': newHash = 'estadisticas'; break;
            case 'terms': newHash = 'terminos'; break;
            case 'profile': newHash = ''; break;
            default: newHash = '';
        }
        if (newHash) {
            history.replaceState(null, '', `${window.location.pathname}#${newHash}`);
        } else {
            history.replaceState(null, '', `${window.location.pathname}`);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return {
        blockSelected,
        handleSelectBlock,
        haveImage,
        fileInputRef,
        handleImageClick
    };
}