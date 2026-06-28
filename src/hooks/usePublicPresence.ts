import { useEffect } from "react";
import { supabase } from "../lib/supabase";

const CHANNEL_NAME = "public-site-presence";

export function usePublicPresence() {
    useEffect(() => {
        if (window.location.pathname.startsWith("/admin")) return;

        const sessionId =
            sessionStorage.getItem("presence_id") ||
            Math.random().toString(36).slice(2);
        sessionStorage.setItem("presence_id", sessionId);

        const channel = supabase.channel(CHANNEL_NAME, {
            config: { presence: { key: sessionId } },
        });

        channel
            .on("presence", { event: "sync" }, () => { })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        session_id: sessionId,
                        page: window.location.pathname,
                        joined_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
}