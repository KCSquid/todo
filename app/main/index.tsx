import { LucideCheck, LucideX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Task {
  value: string;
  checked: boolean;
  dueDate?: string;
}

export function Main() {
  const [listElements, setListElements] = useState<Task[]>([]);
  const ready = useRef(false);

  useEffect(() => {
    const tasks = localStorage.getItem("tasks");
    if (!tasks) return;
    setListElements(JSON.parse(tasks));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      ready.current = true;
    }, 500);
  });

  useEffect(() => {
    if (!ready.current) return;
    localStorage.setItem("tasks", JSON.stringify(listElements));
  }, [listElements]);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-blue-800 to-fuchsia-700">
      <div className="md:w-3/5 w-4/5 h-3/5 bg-white rounded-4xl shadow-lg p-8 flex flex-col gap-4">
        <h1 className="text-3xl text-black font-bold mb-4">To-Do List 📝</h1>
        <div className="w-full h-24 relative">
          <input
            id="task"
            type="text"
            placeholder="Add a new task..."
            autoComplete="off"
            className="bg-neutral-200 rounded-full h-full w-full px-6 text-neutral-700 outline-0 font-medium"
          />
          <button
            className="outline-0 right-0 bg-violet-500 rounded-full uppercase font-bold z-50 absolute h-full lg:w-fit lg:px-20 w-1/4 cursor-pointer hover:bg-violet-600 active:bg-violet-700 transition-colors duration-300"
            aria-label="Add this task to the list"
            onClick={() => {
              if (!ready) return;
              const field = document.getElementById("task") as HTMLInputElement;
              if (!field.value) return;
              const savedValue = field.value;
              setListElements((prev) => [
                ...prev,
                { value: savedValue, checked: false },
              ]);
              field.value = "";
            }}
          >
            add
          </button>
        </div>
        <div className="flex items-center justify-between text-black mb-4">
          <select
            className="cursor-pointer font-bold text-neutral-700 bg-neutral-200 p-2 px-4 rounded-md outline-0"
            onChange={(e) => {
              const filter = e.target.value;
              const taskDiv = document.getElementById("taskDiv");
              if (!taskDiv) return;

              const tasks = Array.from(taskDiv.children) as HTMLElement[];
              tasks.forEach((task) => {
                const input = task.querySelector(
                  "input[type='text']"
                ) as HTMLInputElement;
                const isChecked = input?.classList.contains("line-through");

                if (filter === "all") {
                  task.style.display = "flex";
                } else if (filter === "complete" && isChecked) {
                  task.style.display = "flex";
                } else if (filter === "incomplete" && !isChecked) {
                  task.style.display = "flex";
                } else {
                  task.style.display = "none";
                }
              });
            }}
          >
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <button
            className="cursor-pointer font-bold text-neutral-100 hover:bg-red-600 active:bg-red-700 transition-colors duartion-300 bg-red-500 p-2 px-4 rounded-md"
            onClick={() => setListElements([])}
          >
            clear all
          </button>
        </div>
        <div className="w-full h-full text-black font-medium text-xl">
          <div id="taskDiv" className="flex flex-col gap-2">
            {listElements.map((value, index) => (
              <ListElement
                key={index}
                value={value}
                setListElements={setListElements}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ListElement({
  value,
  setListElements,
  index,
}: {
  value: Task;
  setListElements: React.Dispatch<React.SetStateAction<Task[]>>;
  index: number;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-4 items-center justify-center w-fit">
        <button
          aria-label="Mark as complete"
          className="cursor-pointer"
          onClick={(e) => {
            const checkBox = e.currentTarget.children[0] as HTMLElement;
            const text = e.currentTarget.parentElement
              ?.children[1] as HTMLElement;
            setListElements((prev) =>
              prev.map((item, i) =>
                i === index ? { ...item, checked: !item.checked } : item
              )
            );
            text.classList.toggle("line-through");
          }}
        >
          <div
            className={`w-4 h-4 aspect-square border-2 rounded-full p-3 transition-colors duration-200 ${
              value.checked
                ? "border-violet-500 bg-violet-500"
                : "border-neutral-300"
            }`}
          >
            <LucideCheck
              size={16}
              color="white"
              strokeWidth={4}
              className="-translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </button>
        <input
          type="text"
          className={`text-neutral-600 bg-transparent outline-none focus:underline lg:text-xl text-base  ${
            value.checked ? "line-through" : ""
          }`}
          value={value.value}
          onChange={(e) => {
            const newValue = e.target.value;
            setListElements((prev) =>
              prev.map((item, i) =>
                i === index ? { ...item, value: newValue } : item
              )
            );
          }}
        />
      </div>
      <div className="sm:flex items-center justify-center gap-2 hidden">
        <input
          type="date"
          className={`scheme-light cursor-pointer focus:outline-2 outline-neutral-300 rounded-xl lg:p-2 lg:text-base p-0 text-sm ${
            value.dueDate ? "text-black" : "text-white"
          }`}
          value={value.dueDate}
          onChange={(e) => {
            const selectedDate = e.target.value;
            if (!selectedDate) return;
            setListElements((prev) =>
              prev.map((item, i) =>
                i === index ? { ...item, dueDate: selectedDate } : item
              )
            );
          }}
        />
        <button
          aria-label="Remove this task"
          onClick={() => {
            setListElements((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          <LucideX
            size={24}
            strokeWidth={3}
            color="#525252"
            className="cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
}
