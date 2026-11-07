import { SHOW_TODOS } from "@/content/site";
import { getMessages } from "@/i18n/messages";
import type { Todo } from "@/content/types";

/** [TODO: confirm with founder] markers. Rendered in development (or SHOW_TODOS=1) only; never in production. */
export function TodoNotes({ todos }: { todos: readonly Todo[] | readonly string[] }) {
  if (!SHOW_TODOS || todos.length === 0) return null;
  const m = getMessages();
  return (
    <aside className="rounded-2xl border-2 border-dashed border-rose bg-surface p-4 text-sm text-maroon" data-todo>
      <p className="font-semibold">{m.part.todoHeading}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {todos.map((t) => {
          const text = typeof t === "string" ? t : t.note;
          return <li key={text}>{text}</li>;
        })}
      </ul>
    </aside>
  );
}
