import { useState, useCallback, useRef, useEffect } from "react";
import type { ToastType } from "../components/Toast/Toast";

export function useToast() {
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>("success");
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback((msg: string, t: ToastType = "success") => {
        setMessage(msg);
        setType(t);
        setVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(false), 3000);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return { message, type, visible, showToast };
}