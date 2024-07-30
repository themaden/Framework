import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (token) {
            fetchTodos();
        }
    }, [token]);

    const fetchTodos = () => {
        fetch('http://localhost:3001/todos', {
            headers: { 'Authorization': token }
        })
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.error('Fetch error:', error));
    };

    const register = () => {
        fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                alert('User registered successfully');
            } else {
                alert('User registration failed');
            }
        })
        .catch(error => console.error('Fetch error:', error));
    };

    const login = () => {
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                fetchTodos();
            } else {
                alert('Login failed');
            }
        })
        .catch(error => console.error('Fetch error:', error));
    };

    const addTodo = () => {
        if (newTodo.trim() !== '') {
            const newTodoItem = { text: newTodo, completed: false };
            fetch('http://localhost:3001/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newTodoItem)
            })
            .then(response => response.json())
            .then(todo => {
                setTodos([...todos, todo]);
                setNewTodo('');
            })
            .catch(error => console.error('Fetch error:', error));
        }
    };

    const toggleTodo = (id) => {
        const todo = todos.find(todo => todo.id === id);
        const updatedTodo = { ...todo, completed: !todo.completed };

        fetch(`http://localhost:3001/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedTodo)
        })
        .then(response => response.json())
        .then(updated => {
            const updatedTodos = todos.map(todo => (
                todo.id === id ? updated : todo
            ));
            setTodos(updatedTodos);
        })
        .catch(error => console.error('Fetch error:', error));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'active') return !todo.completed;
        return true;
    }).filter(todo => todo.text.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <h1>TodoMVC</h1>
            <div>
                <h2>Register</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button onClick={register}>Register</button>
            </div>
            <div>
                <h2>Login</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button onClick={login}>Login</button>
            </div>
            <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                onKeyUp={(e) => e.key === 'Enter' && addTodo()}
            />
            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} />
        </div>
    );
};

export default TodoApp;
