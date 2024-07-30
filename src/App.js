import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodoApp from "./components/TodoApp" // TodoApp bileşeninin doğru yolunu kontrol edin
import Login from './Login';
import Register from './Register';
import NotFound from './NotFound';
import Navigation from './Navigation'; // Navigation bileşeninin doğru yolunu kontrol edin

const App = () => {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<TodoApp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
