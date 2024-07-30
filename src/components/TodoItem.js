import React from 'react';

const TodoItem = ({ todo, onToggle }) => {
    return (
        <div>
            <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => onToggle(todo.id)} 
            />
            {todo.text}
            {todo.dueDate && <span> - {new Date(todo.dueDate).toLocaleString()}</span>}
        </div>
    );
};

export default TodoItem;
