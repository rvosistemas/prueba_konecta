import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalWrapper from '../../components/ModalWrapper';

describe('ModalWrapper Component', () => {
  const mockOnRequestClose = jest.fn();

  beforeEach(() => {
    mockOnRequestClose.mockClear();
  });

  it('renders the modal with title and children when open', () => {
    render(
      <ModalWrapper
        isOpen={true}
        onRequestClose={mockOnRequestClose}
        title="Test Modal"
      >
        <div>Modal Content</div>
      </ModalWrapper>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('does not render the modal when closed', () => {
    render(
      <ModalWrapper
        isOpen={false}
        onRequestClose={mockOnRequestClose}
        title="Test Modal"
      >
        <div>Modal Content</div>
      </ModalWrapper>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onRequestClose when Close button is clicked', () => {
    render(
      <ModalWrapper
        isOpen={true}
        onRequestClose={mockOnRequestClose}
        title="Test Modal"
      >
        <div>Modal Content</div>
      </ModalWrapper>
    );

    fireEvent.click(screen.getByText('Close'));

    expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
  });
});
