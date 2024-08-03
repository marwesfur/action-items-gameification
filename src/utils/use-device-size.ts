import {useEffect, useState} from "react";

export default function useDeviceSize() {

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

        return () => {};
    }, []);

    return [width, height]
}
