import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { formatAmount, plMarker } from './utils';
import NoDataOverlay from './NoDataOverlay';
import {isEmpty} from 'lodash';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}



function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {props.headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {props.title}
                    </Typography>
                    {!isEmpty(props.headerSummary) && <>

                        <Box padding={'0 4%'}>
                            <Typography
                                sx={{ flex: '1 1 100%' }}
                                variant="body2"
                                id="tableTitle"
                                component="div"
                            >
                                Invested
                            </Typography>
                            <Typography
                                sx={{ flex: '1 1 100%' }}
                                variant="h6"
                                id="tableTitle"
                                component="div"
                            >

                                &#8377;{formatAmount(props.headerSummary.invested)}
                            </Typography>
                        </Box>
                        <Box padding={'0 4%'}>
                            <Typography
                                sx={{ flex: '1 1 100%', whiteSpace: 'nowrap' }}
                                variant="body2"
                                id="tableTitle"
                                component="div"
                            >
                                Present value
                            </Typography>
                            <Typography
                                sx={{ flex: '1 1 100%' }}
                                variant="h6"
                                id="tableTitle"
                                component="div"
                            >

                                &#8377;{formatAmount(props.headerSummary.value)}
                            </Typography>
                        </Box>
                        <Box padding={'0 4%'}>
                            <Typography
                                sx={{ flex: '1 1 100%', whiteSpace: 'nowrap' }}
                                variant="body2"
                                id="tableTitle"
                                component="div"
                            >
                                Unrealized P&L
                            </Typography>
                            <Typography
                                sx={{ flex: '1 1 100%', whiteSpace: 'nowrap' }}
                                variant="h6"
                                id="tableTitle"
                                component="div"
                            >

                                <Box component='span' marginRight={2}>&#8377;{formatAmount(props.headerSummary.pl)}</Box>
                                <span>&#9650; &#9660;{formatAmount(props.headerSummary.pl_pct)}%</span>
                            </Typography>
                        </Box>
                    </>}
                </>

            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <>
                    <IconButton onClick={props.viewSelected}>
                        <AssessmentIcon />
                    </IconButton>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                    </>
                </Tooltip>
            ) : (
                ''
                // <Tooltip title="Filter list">
                //     <IconButton>
                //         <FilterListIcon />
                //     </IconButton>
                // </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function HoldingsTable(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const navigate = useNavigate();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = props.data.map((n) => n['symbol']);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const viewSelected = () => {
        navigate('/holdings/view:' + selected.join(','));
    }

    // Avoid a layout jump when reaching the last page with empty props.data.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} title={props.title} headerSummary={props.headerSummary} viewSelected={viewSelected} />
            {props.data.length === 0 ? <><NoDataOverlay /></> :
            <>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={props.data.length}
                            headCells={props.headCells}
                        />
                        

                            <TableBody>
                                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 props.data.slice().sort(getComparator(order, orderBy)) */}
                                {stableSort(props.data, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row['symbol']);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row['symbol'])}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row['id']}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                                                        <Box component='span'>{row['symbol']}</Box>
                                                        <Tooltip title="Long term holdings" placement="top" arrow>
                                                            <Box sx={{ color: 'success.main' }} component='span'>{row['quantity_long_term'] > 0 ? <><CalendarTodayOutlinedIcon color='success' fontSize='small' sx={{ height: '12px', width: '12px' }} /> {row['quantity_long_term']}</> : ''}</Box>
                                                        </Tooltip>
                                                    </Box>

                                                </TableCell>
                                                <TableCell align="right">{formatAmount(row['quantity_available'])}</TableCell>
                                                <TableCell align="right">{formatAmount(row['average_price'])}</TableCell>
                                                <TableCell align="right">{formatAmount(row['invested'])}</TableCell>
                                                <TableCell align="right">{formatAmount(row['previous_closing_price'])}</TableCell>
                                                <TableCell align="right">{formatAmount(row['value'])}</TableCell>
                                                <TableCell align="right">{plMarker(formatAmount(row['unrealized_pl']))}</TableCell>
                                                <TableCell align="right">{row['unrealized_pl_pct'] ? plMarker(formatAmount(row['unrealized_pl_pct']), true): '-'}</TableCell>
                                                <TableCell align="right">{formatAmount(row['weight'])}%</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={props.data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </>
}
            </Paper>
            {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
        </Box>
    );
}
