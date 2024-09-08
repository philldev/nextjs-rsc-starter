"use client";

import { Todo } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Loader } from "lucide-react";
import * as React from "react";

type Action =
  | {
      type: "add";
      payload: Pick<Todo, "title" | "id">;
    }
  | {
      type: "update";
      id: string;
      payload: Partial<Pick<Todo, "title" | "completed">>;
    }
  | {
      type: "delete";
      id: string;
    };

type State = {
  todos: Todo[];
};

const Context = React.createContext<{
  todos: Todo[];
  dispatch: React.Dispatch<Action>;
  pending: boolean;
  startTransition: React.TransitionStartFunction;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return {
        todos: [
          {
            ...action.payload,
            completed: false,
            editing: false,
            createdAt: new Date(),
          },
          ...state.todos,
        ],
      };
    case "update":
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.id
            ? {
                ...todo,
                ...action.payload,
                editing: false,
              }
            : todo,
        ),
      };
    case "delete":
      return {
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
  }
}

export function useTodosOptimistic() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useTodosOptimistic must be used within a TodosProvider");
  }

  return context;
}

interface TodosProviderProps {
  children: React.ReactNode;
  initialTodos: Todo[];
}

export function TodosProvider({ children, initialTodos }: TodosProviderProps) {
  const [pending, startTransition] = React.useTransition();

  const [state, dispatch] = React.useOptimistic(
    {
      todos: initialTodos ?? [],
    },
    reducer,
  );

  return (
    <Context.Provider
      value={{ todos: state.todos, dispatch, pending, startTransition }}
    >
      {children}
    </Context.Provider>
  );
}

export function PendingTransitionSpinner() {
  const { pending } = useTodosOptimistic();

  return (
    <div className="rounded-sm border-border z-50 w-max absolute top-2 right-2">
      <ReloadIcon
        className={cn(
          "w-3 h-3 text-muted-foreground data-[hidden=true]:hidden",
          pending && "animate-[spin_3.5s_linear_infinite] opacity-100",
          !pending && "opacity-0",
        )}
      />
    </div>
  );
}
