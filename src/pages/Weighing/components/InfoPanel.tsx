import { useState, type ReactNode } from "react";

// Згортана панель: кнопка із заголовком і стрілкою, вміст показується
// після кліку. Стан відкриття живе тут же.
export default function InfoPanel({
  title,
  className = "registry-info",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <button className="registry-info-toggle" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && children}
    </div>
  );
}
