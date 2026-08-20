import { useEffect, useState } from "react";

export function useOnlineStatus() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const update = () => setIsOffline(!navigator.onLine);
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        update();
        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, []);

    return isOffline;
}