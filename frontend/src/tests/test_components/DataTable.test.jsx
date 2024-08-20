import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '../../components/DataTable';

describe('DataTable Component', () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' }
  ];

  const data = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ];

  const mockEdit = jest.fn();
  const mockDelete = jest.fn();

  it('renders the table with columns and data', () => {
    render(<DataTable columns={columns} data={data} onEdit={mockEdit} onDelete={mockDelete} showActions={true} />);

    // Check if table is rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check if columns are rendered
    columns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });

    // Check if data is rendered
    data.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('renders action buttons if showActions is true', () => {
    render(<DataTable columns={columns} data={data} onEdit={mockEdit} onDelete={mockDelete} showActions={true} />);

    // Check for Edit buttons
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons).toHaveLength(data.length);

    // Check for Delete buttons
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(data.length);

    // Simulate clicking the Edit button
    fireEvent.click(editButtons[0]);
    expect(mockEdit).toHaveBeenCalledWith(data[0]);

    // Simulate clicking the Delete button
    fireEvent.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalledWith(data[0].id);
  });

  it('does not render action buttons if showActions is false', () => {
    render(<DataTable columns={columns} data={data} onEdit={mockEdit} onDelete={mockDelete} showActions={false} />);

    const editButton = screen.queryByText('Edit');
    const deleteButton = screen.queryByText('Delete');

    expect(editButton).not.toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('formats data correctly if formatter is provided', () => {
    const columnsWithFormatter = [
      { label: 'ID', field: 'id' },
      { label: 'Name', field: 'name', formatter: (name) => `Name: ${name}` }
    ];

    render(<DataTable columns={columnsWithFormatter} data={data} onEdit={mockEdit} onDelete={mockDelete} showActions={false} />);

    // Check if the formatter works
    expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Name: Jane Doe')).toBeInTheDocument();
  });
});
