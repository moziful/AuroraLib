import { MdGppGood, MdCreate, MdMenuBook } from "react-icons/md";

export default function RoleBadge({ role = "" }) {
  const normalizedRole = String(role).trim().toLowerCase();

  const roleStyles = {
    admin: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    writer: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    reader: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    user: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  };

  const icons = {
    admin: MdGppGood,
    writer: MdCreate,
    reader: MdMenuBook,
    user: MdMenuBook,
  };

  const currentStyle = roleStyles[normalizedRole] || roleStyles.reader;
  const Icon = icons[normalizedRole] || MdMenuBook;
  
  const displayRole = normalizedRole 
    ? (normalizedRole === "user" ? "Reader" : normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1))
    : "Reader";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-md border py-0.5 text-xs font-semibold tracking-wide uppercase w-24 shrink-0 ${currentStyle}`}
    >
      <Icon className="text-sm shrink-0" />
      <span>{displayRole}</span>
    </span>
  );
}
