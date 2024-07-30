import React, { useState } from 'react';

const TodoForm = ({ onAddTodo }) => {
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAddTodo({
                text,
                dueDate: dueDate || null,  // Tarih belirlenmemişse null olarak ayarla
                completed: false,
                id: Date.now()
            });
            setText('');
            setDueDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="Add a new todo"
            />
            <input 
                type="datetime-local" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)}
            />
            <button type="submit">Add</button>
        </form>
    );
};

export default TodoForm;
