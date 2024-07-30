import React from 'react';

const TodoList = ({ todos, toggleTodo }) => {
    return (
        <ul>
            {todos.map(todo => (
                <li
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        cursor: 'pointer'
                    }}
                >
                    {todo.text} <br/>
                    <small>Category: {todo.category}</small><br/>
                    <small>Tags: {todo.tags.join(', ')}</small>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
