import PropTypes from 'prop-types';

const DataTable = ({ columns, data, onEdit, onDelete, showActions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2 border-b">
                {column.label}
              </th>
            ))}
            {showActions && (
              <th className="px-4 py-2 border-b">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-b">
                  {column.formatter ? column.formatter(item[column.field]) : item[column.field]}
                </td>
              ))}
              {showActions && (
                <td className="px-4 py-2 border-b flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      formatter: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired,
};

export default DataTable;
