// Modal.jsx
import React from 'react';
import { X } from 'lucide-react';
import './Modal_style.css';

const Modal = ({ message, onClose, onConfirm }) => {
    return (
        <div className="modal_backdrop">
            <div className="modal_content">
                <button className="close_button" onClick={onClose}><X size={16}/></button>
                <div className="modal_message">{message}</div>
                <button className="confirm_button" onClick={onConfirm}>Proceed</button>
            </div>
        </div>
    );
};

export default Modal;
