import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function MyRenderer(params) {
    return (
        <span className="my-renderer">
            <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" className="my-spinner"/>
            {params.value}
        </span>
    );
}

// const MyReactEditor = memo(forwardRef((props, ref) => {
//
//     const [value, setValue] = useState(parseInt(props.value));
//     const refInput = useRef(null);
//
//     // Cell Editor interface, that the grid calls
//     useImperativeHandle(ref, () => {
//         return {
//             // the final value to send to the grid, on completion of editing
//             getValue() {
//                 // this simple editor doubles any value entered into the input
//                 return value;
//             }
//         };
//     });
//
//     const onChangeListener = useCallback(event => setValue(event.target.value), []);
//     useEffect(() => refInput.current.focus(), []);
//
//     return (
//         <input type="number" className="my-editor"
//                ref={refInput}
//                value={value}
//                onChange={onChangeListener}
//         />
//     );
// }));


const App = (factory, deps) => {
        const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
        const gridRef = useRef(null); // Optional - for accessing Grid's API
        const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

        // Each Column Definition results in one Column.
        const columnDefs = useMemo(() => [
            {headerName: '터미널코드', field: 'code', filter: true, cellRenderer: MyRenderer},
            {headerName: '터미널명', field: 'name', filter: true, editable: true},
            //{field: 'contract1', filter: true},
            {headerName: 'TMS 코드', field: 'tmsSortCode', filter: true},
            //{field: 'wheelSorterCode', filter: true},
            {headerName: '우편번호', field: 'zipcode', filter: true},
            {headerName: '주소', field: 'address1', filter: true}
        ]);

        // DefaultColDef sets props common to all Columns
        const defaultColDef = useMemo(() => ({
            sortable: true,
            resizable: true
        }));

        const columnTypes = {
            nonEditableColumn: {editable: false}
        };

        // Example of consuming Grid Event
        const cellClickedListener = useCallback(event => {
            //console.log('cellClicked', event);
        }, []);

        // Example load data from sever
        useEffect(() => {

                axios.post('https://test-api.gftms.com/api/td/terminal', null, {
                    headers:
                        {
                            "Content-Type": `application/json`
                            , 'TMS-APP-CODE': 'HOMEPICK'
                            , 'TMS-APP-KEY': '38e0bc42-e060-11eb-ba80-0242ac130004'
                        }
                })
                    .then(result => {
                        return result.data.data;
                    })
                    .then(rowData => setRowData(rowData))

            }, []
        )
        ;

// Example using Grid's API
        const buttonListener = useCallback(e => {
            gridRef.current.api.deselectAll();
        }, []);

        return (
            <div style={containerStyle}>

                {/* Example using Grid's API */}
                <button onClick={buttonListener}>Push Me</button>

                {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
                <div style={{height: '100%', boxSizing: 'border-box'}}>
                    <div style={gridStyle} className="ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef} // Ref for accessing Grid's API

                            rowData={rowData} // Row Data for Rows

                            columnDefs={columnDefs} // Column Defs for Columns
                            defaultColDef={defaultColDef} // Default Column Properties
                            columnTypes={columnTypes}

                            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                            rowSelection='multiple' // Options - allows click selection of rows

                            enableRangeSelection="true"
                            onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                        />
                    </div>
                </div>
            </div>
        );
    }
;

export default App;