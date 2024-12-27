import { useState, useEffect } from 'react'
import './App.css'

export default function ToDoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, todoId: null })
  const [editingTodo, setEditingTodo] = useState(null)
  const [selectedTodos, setSelectedTodos] = useState(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [todoDetails, setTodoDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    priority: false,
    type: 'none'
  })

  function addTodo() {
    if (newTodo.trim() !== '') {
      setShowModal(true)
    }
  }

  function handleSubmit() {
    if (editingTodo) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, text: newTodo, date: todoDetails.date, priority: todoDetails.priority, type: todoDetails.type }
          : todo
      ))
      setEditingTodo(null)
    } else {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          date: todoDetails.date,
          priority: todoDetails.priority,
          type: todoDetails.type,
          completed: false
        }
      ])
    }
    setNewTodo('')
    setShowModal(false)
    setTodoDetails({
      date: new Date().toISOString().split('T')[0],
      priority: false,
      type: 'none'
    })
  }

  function handleContextMenu(e, todo) {
    e.preventDefault()
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      todoId: todo.id
    })
  }

  function handleEdit(todo) {
    setEditingTodo(todo)
    setNewTodo(todo.text)
    setTodoDetails({
      date: todo.date,
      priority: todo.priority,
      type: todo.type
    })
    setShowModal(true)
    setContextMenu({ show: false, x: 0, y: 0, todoId: null })
  }

  function handleDelete(todoId) {
    setTodos(todos.filter(todo => todo.id !== todoId))
    setContextMenu({ show: false, x: 0, y: 0, todoId: null })
  }

  function handleTodoClick(todo) {
    const newSelected = new Set(selectedTodos)
    if (newSelected.has(todo.id)) {
      newSelected.delete(todo.id)
    } else {
      newSelected.add(todo.id)
    }
    setSelectedTodos(newSelected)
    setShowDeleteModal(newSelected.size > 0)
  }

  function handleDeleteSelected() {
    setTodos(todos.filter(todo => !selectedTodos.has(todo.id)))
    setSelectedTodos(new Set())
    setShowDeleteModal(false)
  }

  useEffect(() => {
    function handleClick() {
      setContextMenu({ show: false, x: 0, y: 0, todoId: null })
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Morning'
    if (hour < 17) return 'Afternoon'
    return 'Evening'
  }

  const getMonthAndDay = () => {
    const date = new Date()
    const month = date.toLocaleString('default', { month: 'short' })
    const day = date.getDate()
    return { month, day }
  }

  const { month, day } = getMonthAndDay()

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col p-8">
      <div className="absolute top-4 left-4 text-stone-600 text-sm">
        Created by Varun Nukaka
      </div>
      <div className="flex flex-col items-start mx-[15%] space-y-1">
        <div className="text-stone-500 text-lg mb-2">
          {month} {day}
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">
          Good {getTimeOfDay()}.
        </h1>
        <p className="text-3xl text-stone-500 font-semibold">
          What's would you like to do?
        </p>
      </div>

      <div className="flex-1 mx-[15%] flex flex-col mt-12">
        <div className="flex gap-4 mb-8">
          <input
            className="flex-1 p-4 bg-[#2a2a2a] border-none rounded-lg 
                       text-stone-300 placeholder-stone-600
                       focus:outline-none focus:ring-1 focus:ring-stone-400
                       hover:ring-1 hover:ring-stone-400
                       transition-all duration-150
                       text-[15px]"
            type="text"
            placeholder="Add Todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTodo()
              }
            }}
          />
          <button
            className="bg-[#2a2a2a] hover:bg-stone-600 text-stone-300 font-medium py-4 px-8 rounded-lg 
                       transition-all duration-150 outline-none
                       focus:outline-none"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        <ul className="space-y-4">
          {todos.map((todo) => {
            const isSelected = selectedTodos.has(todo.id);
            return (
              <li key={todo.id}
              onClick={() => handleTodoClick(todo)}
              onContextMenu={(e) => handleContextMenu(e, todo)}
              className={`flex items-center justify-between p-4 ${isSelected ? 'bg-[#404040]' : 'bg-[#2a2a2a]'} 
                         hover:bg-[#404040] rounded-lg transition-all duration-150 
                         cursor-pointer`}>
                <div className="flex items-center gap-4">
                  {todo.priority && (
                    <span className="text-amber-500 text-xl">★</span>
                  )}
                  {!todo.priority && (
                    <span className="text-stone-600 text-xl">☆</span>
                  )}
                  <span className="text-stone-300 text-[15px]">{todo.text}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-stone-500 text-sm">{todo.date}</span>
                  {todo.type !== 'none' && (
                    <span className="text-stone-400 text-sm">#{todo.type}</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        {showDeleteModal && selectedTodos.size > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                        bg-[#2a2a2a] rounded-lg shadow-lg p-4 flex items-center gap-4">
            <span className="text-stone-300">
              Delete {selectedTodos.size} {selectedTodos.size === 1 ? 'item' : 'items'}?
            </span>
            <button 
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              Delete
            </button>
            <button 
              onClick={() => {
                setSelectedTodos(new Set())
                setShowDeleteModal(false)
              }}
              className="px-4 py-2 text-stone-600 hover:text-stone-500"
            >
              Cancel
            </button>
          </div>
        )}

        {contextMenu.show && (
          <div 
            className="fixed bg-[#2a2a2a] rounded-lg shadow-lg py-2 z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button 
              className="w-full px-4 py-2 text-left text-stone-600 hover:bg-stone-600"
              onClick={() => handleEdit(todos.find(t => t.id === contextMenu.todoId))}
            >
              Edit
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-stone-600"
              onClick={() => handleDelete(contextMenu.todoId)}
            >
              Delete
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#2a2a2a] p-6 rounded-lg w-[400px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-stone-300">
                  {editingTodo ? 'Edit Todo' : 'Add Todo Details'}
                </h3>
                <span className="text-stone-500 text-sm">right click to edit later</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-stone-400 mb-2">Date</label>
                  <input
                    type="date"
                    value={todoDetails.date}
                    onChange={(e) => setTodoDetails({...todoDetails, date: e.target.value})}
                    className="w-full p-2 bg-[#1a1a1a] text-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-2">Priority</label>
                  <select
                    value={todoDetails.priority.toString()}
                    onChange={(e) => setTodoDetails({...todoDetails, priority: e.target.value === 'true'})}
                    className="w-full p-2 bg-[#1a1a1a] text-stone-300 rounded-lg focus:outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-2">Type</label>
                  <select
                    value={todoDetails.type}
                    onChange={(e) => setTodoDetails({...todoDetails, type: e.target.value})}
                    className="w-full p-2 bg-[#1a1a1a] text-stone-300 rounded-lg focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="reminder">Reminder</option>
                    <option value="alert">Alert</option>
                    <option value="tag">Tag</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-stone-600 text-stone-300 rounded-lg hover:bg-stone-500"
                  >
                    {editingTodo ? 'Save Changes' : 'Add Todo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}