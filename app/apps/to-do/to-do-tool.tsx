"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn, pluralize } from "@/lib/utils";

const STORAGE_KEY = "sia:todos";

interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

type Filter = "all" | "active" | "completed";

export function ToDoTool() {
  const [todos, setTodos, hydrated] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [draft, setDraft] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const editRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editingId) editRef.current?.select();
  }, [editingId]);

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    setTodos((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        title,
        done: false,
        createdAt: Date.now(),
      },
    ]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );

  const remove = (id: string) => {
    const removed = todos.find((todo) => todo.id === id);
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
    if (removed) {
      toast("Task deleted", {
        description: removed.title,
        action: {
          label: "Undo",
          // Re-inserting at the end is acceptable: order is user-controlled
          // and the alternative (tracking the index) adds state for little gain.
          onClick: () => setTodos((previous) => [...previous, removed]),
        },
      });
    }
  };

  const move = (id: string, direction: -1 | 1) =>
    setTodos((previous) => {
      const index = previous.findIndex((todo) => todo.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= previous.length) return previous;
      const next = [...previous];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item!);
      return next;
    });

  const commitEdit = () => {
    const title = editTitle.trim();
    if (editingId && title) {
      setTodos((previous) =>
        previous.map((todo) =>
          todo.id === editingId ? { ...todo, title } : todo
        )
      );
    }
    setEditingId(null);
  };

  const clearCompleted = () => {
    const count = todos.filter((todo) => todo.done).length;
    setTodos((previous) => previous.filter((todo) => !todo.done));
    toast.success(`Cleared ${count} completed ${pluralize(count, "task")}`);
  };

  const completed = todos.filter((todo) => todo.done).length;
  const visible = todos.filter((todo) =>
    filter === "active" ? !todo.done : filter === "completed" ? todo.done : true
  );
  const progress = todos.length > 0 ? (completed / todos.length) * 100 : 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              add();
            }}
            className="flex gap-2"
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What needs doing?"
              aria-label="New task"
              maxLength={200}
              className="h-11"
            />
            <Button type="submit" size="lg" disabled={!draft.trim()}>
              <Plus className="size-4" aria-hidden />
              <span className="max-sm:sr-only">Add</span>
            </Button>
          </form>

          {todos.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {completed} of {todos.length} done
                </span>
                <span className="font-medium tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress
                value={progress}
                aria-label="Completion progress"
                indicatorClassName={progress === 100 ? "bg-success" : undefined}
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* A toggle group, not tabs: there is no tabpanel to control, and
                `Tabs` would emit an aria-controls pointing at nothing. */}
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(value) => value && setFilter(value as Filter)}
              aria-label="Filter tasks"
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="active">Active</ToggleGroupItem>
              <ToggleGroupItem value="completed">Done</ToggleGroupItem>
            </ToggleGroup>
            {completed > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            ) : null}
          </div>

          {!hydrated ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title={
                todos.length === 0
                  ? "Nothing on your list"
                  : filter === "active"
                    ? "All caught up"
                    : "Nothing completed yet"
              }
              description={
                todos.length === 0
                  ? "Add your first task above. Everything stays in this browser — no account needed."
                  : filter === "active"
                    ? "Every task is done. Well played."
                    : "Complete a task and it will show up here."
              }
              className="py-10"
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {visible.map((todo) => {
                const index = todos.indexOf(todo);
                const isEditing = editingId === todo.id;

                return (
                  <li
                    key={todo.id}
                    className={cn(
                      "group border-border/70 bg-card flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                      todo.done && "bg-muted/40",
                      isEditing && "border-primary/50"
                    )}
                  >
                    <Checkbox
                      checked={todo.done}
                      onCheckedChange={() => toggle(todo.id)}
                      aria-label={`Mark "${todo.title}" as ${todo.done ? "not done" : "done"}`}
                      disabled={isEditing}
                    />

                    {isEditing ? (
                      <Input
                        ref={editRef}
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") commitEdit();
                          if (event.key === "Escape") setEditingId(null);
                        }}
                        onBlur={commitEdit}
                        aria-label="Edit task"
                        className="h-8"
                      />
                    ) : (
                      <button
                        type="button"
                        onDoubleClick={() => {
                          setEditingId(todo.id);
                          setEditTitle(todo.title);
                        }}
                        className={cn(
                          "flex-1 truncate rounded text-left text-sm transition-colors",
                          todo.done && "text-muted-foreground line-through"
                        )}
                        title={todo.title}
                      >
                        {todo.title}
                      </button>
                    )}

                    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Save"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={commitEdit}
                          >
                            <Check className="text-success size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Cancel"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => setEditingId(null)}
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Move "${todo.title}" up`}
                            disabled={index === 0}
                            onClick={() => move(todo.id, -1)}
                            className="max-sm:hidden"
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Move "${todo.title}" down`}
                            disabled={index === todos.length - 1}
                            onClick={() => move(todo.id, 1)}
                            className="max-sm:hidden"
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Rename "${todo.title}"`}
                            onClick={() => {
                              setEditingId(todo.id);
                              setEditTitle(todo.title);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete "${todo.title}"`}
                            onClick={() => remove(todo.id)}
                            className="hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-xs">
        Double-click a task to rename it. Your list is stored in this browser
        only.
      </p>
    </div>
  );
}
