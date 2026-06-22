import { useState, useCallback } from "react";
import type { ToastType } from "../components/Toast/Toast";

export function useToast() {
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>("success");
    const [visible, setVisible] = useState(false);

    const showToast = useCallback((msg: string, t: ToastType = "success") => {
        setMessage(msg);
        setType(t);
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
    }, []);

    return { message, type, visible, showToast };
}