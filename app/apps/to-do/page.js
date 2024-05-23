"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCheck,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";
import { uuid } from "@utils";

const ToDo = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/to-do", title: "To-Do" },
  ];

  const [todo, setTodo] = useState("");
  const [editId, setEditId] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTitle, setEditTitle] = useState("");

  const deleteTodo = (item) => {
    setTodos((prev) => {
      const _todos = prev.filter((_todo) => _todo.id !== item.id);
      localStorage.setItem("to-do", JSON.stringify(_todos));
      return _todos;
    });
  };

  const resetTodo = () => {
    setTodo("");
    setEditId("");
    setTodos([]);
    setEditTitle("");
    localStorage.setItem("to-do", JSON.stringify([]));
  };

  const editToDo = () => {
    setTodos((prev) => {
      const _todos = prev.map((_todo) => {
        return _todo.id === editId
          ? {
              ..._todo,
              title: editTitle,
            }
          : _todo;
      });
      localStorage.setItem("to-do", JSON.stringify(_todos));
      return _todos;
    });
    setEditId("");
  };

  const toggleIsComplete = (item) => {
    if (editId) return;
    setTodos((prev) => {
      const _todos = prev.map((_todo) =>
        _todo.id === item.id
          ? { ..._todo, isComplete: !_todo.isComplete }
          : _todo
      );
      localStorage.setItem("to-do", JSON.stringify(_todos));
      return _todos;
    });
  };

  const addTodo = () => {
    if (!todo) return;
    setTodos((prev) => {
      const _todos = [...prev, { title: todo, isComplete: false, id: uuid() }];
      localStorage.setItem("to-do", JSON.stringify(_todos));
      return _todos;
    });
    setTodo("");
  };

  useEffect(() => {
    let _todos = localStorage.getItem("to-do");
    _todos = _todos ? JSON.parse(_todos) : [];
    setTodos(_todos);
  }, []);

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* To-Do */}
        <div className="flex justify-center w-full">
          <div className="max-w-[600px] w-full border border-gray-300 rounded-md shadow-sm p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            <div className="flex justify-between">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                ToDo
              </h1>
              <button
                type="button"
                className="border border-red-400 text-sm rounded-md py-2 px-4"
                onClick={resetTodo}
              >
                Reset
              </button>
            </div>

            {/* ToDo Items */}
            {todos.length !== 0 && (
              <div className="max-h-600 rounded-md overflow-y-auto">
                <div className="w-full flex gap-2 border border-gray-300 rounded-md p-2">
                  <ul className="w-full">
                    {todos.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="flex items-center gap-1 my-2"
                        >
                          <span>{index + 1}. </span>
                          <input
                            type="text"
                            value={editId ? editTitle : item.title}
                            disabled={editId ? false : true}
                            className={`w-full py-1 px-2 border rounded-md focus:outline-none focus:border-gray-400 ${
                              item.isComplete && "line-through"
                            }`}
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                editToDo();
                              }
                            }}
                            onChange={(e) => {
                              if (item.isComplete) return;
                              const title = e.target.value;
                              setEditTitle(title);
                            }}
                          />
                          {/* Edit */}
                          <button
                            title="Edit"
                            className="py-1 px-2 border rounded-md"
                            onClick={() => {
                              if (editId) {
                                editToDo();
                                return;
                              }
                              if (item.isComplete) return;
                              setEditId(item.id);
                              setEditTitle(item.title);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} color="blue" />
                          </button>
                          {/* Mark as Complete */}
                          <button
                            title="Mark as Complete"
                            data-id={item.id}
                            className="py-1 px-2 border rounded-md"
                            onClick={() => toggleIsComplete(item)}
                          >
                            <FontAwesomeIcon icon={faCheck} color="green" />
                          </button>
                          {/* Delete */}
                          <button
                            title="Delete"
                            className="py-1 px-2 border rounded-md"
                            onClick={() => deleteTodo(item)}
                          >
                            <FontAwesomeIcon icon={faTrash} color="red" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            <div className="w-full flex gap-1 border border-gray-300 rounded-md p-2">
              <input
                type="text"
                value={todo}
                className="w-full focus:outline-none focus:border-gray-400 px-2"
                onChange={(e) => setTodo(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
                placeholder="Enter todo item"
              />
              <button
                title="Add"
                type="button"
                className="px-2"
                onClick={addTodo}
              >
                <FontAwesomeIcon icon={faPaperPlane} color="gray" />
              </button>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can add new to-do items by typing in the input field and
              pressing Enter or clicking the send button.
            </li>
            <li className="ml-4">
              Users can edit existing to-do items by clicking the edit button,
              making changes, and then saving them by clicking the check button.
            </li>
            <li className="ml-4">
              Users will be able to mark to-do items as complete or incomplete
              by clicking the check button next to each item.
            </li>
            <li className="ml-4">
              Users will be able to delete to-do items by clicking the trash
              button next to each item.
            </li>
            <li className="ml-4">
              Users will see their to-do list saved in local storage, so the
              list persists across page reloads.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default ToDo;
