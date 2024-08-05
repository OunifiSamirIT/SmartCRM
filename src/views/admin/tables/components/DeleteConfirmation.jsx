import React from 'react';
import Modal from 'react-modal';

const DeleteConfirmation = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Confirmation"
      className="modal2"
      overlayClassName="overlay"
    >
      <div className="bg-white rounded-lg ml-6 shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this article?</p>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
