import { Button, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import React from 'react'

const ToggleTheme = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const handleClick = () => {
        toggleColorMode();
        const styleEl = document.createElement('style');
        const cssText = document.createTextNode(
            'html * { transition: color, background-color 0.3s ease-out!important }',
        );
        styleEl.appendChild(cssText);
        document.head.appendChild(styleEl);
        setTimeout(() => {
            document.head.removeChild(styleEl);
        }, 300);
    };
    return (
        <Button
            bg={colorMode === "light" ? "gray.100" : "gray.700"}
            onClick={handleClick}
            transition="background 0.2s ease"
        >{colorMode === "light" ? <MoonIcon /> : <SunIcon />}</Button>
    )
}

export default ToggleTheme