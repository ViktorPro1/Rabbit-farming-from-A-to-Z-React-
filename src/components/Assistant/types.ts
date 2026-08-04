export interface Message {
    sender: "bot" | "user";
    text: string;
    path?: string;
    linkLabel?: string;
}