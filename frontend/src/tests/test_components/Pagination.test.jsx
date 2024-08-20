import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../components/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders the current page and total pages', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />
    );

    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  it('disables the Previous button on the first page', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(
      <Pagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with the previous page when Previous is clicked', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );

    fireEvent.click(screen.getByText('Previous'));

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with the next page when Next is clicked', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
    );

    fireEvent.click(screen.getByText('Next'));

    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });
});
