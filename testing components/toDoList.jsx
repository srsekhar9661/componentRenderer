import React, { useState } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Build React components', completed: true },
    { id: 2, text: 'Test JSX uploader', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const containerStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '2rem',
    color: 'white',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem',
    backdropFilter: 'blur(10px)'
  };

  const todoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    marginBottom: '0.5rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #4ade80, #22c55e)',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '25px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1rem'
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={containerStyle}>
      <h2 style={{textAlign: 'center', margin: '0 0 2rem 0', fontSize: '2rem'}}>
        ✅ Todo List
      </h2>

      <div style={{marginBottom: '2rem'}}>
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          style={inputStyle}
        />
        <button 
          onClick={addTodo}
          style={buttonStyle}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Add Todo
        </button>
      </div>

      <div>
        {todos.map(todo => (
          <div 
            key={todo.id} 
            style={{
              ...todoItemStyle,
              opacity: todo.completed ? 0.7 : 1,
              background: todo.completed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateX(5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{marginRight: '1rem', transform: 'scale(1.2)'}}
            />
            <span style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                background: 'rgba(239, 68, 68, 0.7)',
                border: 'none',
                borderRadius: '5px',
                padding: '0.5rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div style={{textAlign: 'center', marginTop: '1.5rem', opacity: 0.8}}>
        {todos.filter(t => !t.completed).length} of {todos.length} tasks remaining
      </div>
    </div>
  );
};

export default TodoList;