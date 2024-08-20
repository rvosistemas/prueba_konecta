import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const ModalWrapper = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button
          onClick={onRequestClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalWrapper;
