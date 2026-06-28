import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Окремий анонімний клієнт для публічного сайту
const supabasePublic = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CHANNEL_NAME = "public-site-presence";

export function usePublicPresence() {
    useEffect(() => {
        const sessionId =
            sessionStorage.getItem("presence_id") ||
            Math.random().toString(36).slice(2);
        sessionStorage.setItem("presence_id", sessionId);

        const channel = supabasePublic.channel(CHANNEL_NAME, {
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
            supabasePublic.removeChannel(channel);
        };
    }, []);
}