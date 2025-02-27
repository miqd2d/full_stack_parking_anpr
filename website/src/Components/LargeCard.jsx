import React, { useEffect, useState } from 'react';
import './LargeCard_style.css';
import Webcam from 'react-webcam';
import { useTable, useSortBy } from 'react-table';
import axios from 'axios';

function LargeCard({ title, for: type ,isWide }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (title === "Logs") {
            const fetchLogs = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/admin/logs');
                    setLogs(response.data);
                } catch (error) {
                    console.error("Error fetching logs:", error);
                }
            };
            fetchLogs();
        }
    }, [title]);

    const columns = React.useMemo(
        () => [
            { Header: 'Plate Number', accessor: 'plate_no' },
            { Header: 'Username', accessor: 'username' },
            {
                Header: 'Date & Time Entry',
                accessor: 'datetime_entry',
                Cell: ({ value }) => {
                    // Format the datetime entry as DD-MM-YYYY HH:MM
                    const date = new Date(value);
                    const formattedDate = date.toLocaleDateString('en-GB'); // DD-MM-YYYY
                    const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // HH:MM
                    return `${formattedDate} ${formattedTime}`;
                }
            },
            {
                Header: 'In/Out Status',
                accessor: 'in_out_status',
                Cell: ({ value }) => (
                    <span className={value === 'IN' ? 'status-in' : 'status-out'}>
                        {value}
                    </span>
                )
            }
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data: logs },
        useSortBy
    );

    return (
        <div className='box_main_large' style={{ width: isWide ? '50%' : '30%' }}>
            <div className="heading_large">{title}</div>
            {type === "video" ? (
                <Webcam audio={false} id='webcam' />
            ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table {...getTableProps()} className="log-table">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default LargeCard;
