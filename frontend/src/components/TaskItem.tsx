import React, { useState } from "react";
import Image from "next/image";

interface TaskItemProps {
  todo: {
    _id: string;
    title: string;
    completed: boolean;
  };
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ todo, onEdit, onDelete, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(todo.completed);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>(todo.title);

  return (
    <li className="text-white flex items-center border-2 border-gray-500 rounded-lg p-2 py-3 my-4 bg-gray-900">
      <input
        type="checkbox"
        className="mr-2 w-5"
        defaultChecked={isCompleted}
        onChange={() => {
          setIsCompleted((prev: boolean) => !prev);
          onComplete(todo._id);
        }}
      />
      <input
        className="flex-grow text-lg"
        value={taskValue}
        onChange={(e) => setTaskValue(e.target.value)}
        disabled={!isEditable}
      />
      <div className="flex gap-2">
        <Image
          src={isEditable ? "/save.svg" : "/edit.svg"}
          alt="edit"
          width={20}
          height={20}
          className="w-5 h-5 cursor-pointer transform transition-transform hover:scale-110"
          onClick={() => {
            if (!taskValue) return;
            setIsEditable((prev) => !prev);
            if (!isEditable) return;
            onEdit(todo._id, taskValue);
          }}
        />
        <Image
          src="/delete.svg"
          alt="delete"
          width={20}
          height={20}
          className="w-5 h-5 cursor-pointer transform transition-transform hover:scale-110"
          onClick={() => onDelete(todo._id)}
        />
      </div>
    </li>
  );
};

export default TaskItem;
