import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  {
    id: "transactionId",
    label: "TransactionID",
    minWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "value",
    label: "Value",
    minWidth: 70,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "type",
    label: "Type",
    minWidth: 70,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  { id: "parentId", label: "ParentID", minWidth: 70 },
  { id: "linkId", label: "LinkID", minWidth: 70 },
];
const columns2 = [
  { id: "id", label: "ID", minWidth: 20 },
  {
    id: "flatPath",
    label: "FlatPath",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function App() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [t1data, setT1data] = useState([]);
  const [t2data, setT2data] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [value, setValue] = useState(null);
  const [type, setType] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [totalSum, setTotalsum] = useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const url = "https://transaction-service-loco.herokuapp.com";
  function getData() {
    axios
      .get(`${url}/transactionService/transaction/bulk`, {})
      .then((response) => {
        const data = response.data;
        setT1data(data);
        console.log(data);
      })
      .catch((err) => console.log("Something went wrong.", err));
  }
  function getData2() {
    axios
      .get(`${url}/transactionLinkService/links/bulk`, {})
      .then((response) => {
        const data = response.data;
        setT2data(data);
        console.log(data);
      })
      .catch((err) => console.log("Something went wrong.", err));
  }
  function filterData() {
    axios
      .get(`${url}/transactionService/types/${type}`, {})
      .then((response) => {
        const data = response.data;
        setT1data(data);
        console.log(data);
      })
      .catch((err) => console.log("Something went wrong.", err));
  }
  function getResult() {
    axios
      .get(`${url}/transactionService/sum/${transactionId}`, {})
      .then((response) => {
        const data = response.data;
        setTotalsum(data.sum);
        console.log(data);
      })
      .catch((err) => console.log("Something went wrong.", err));
  }
  function filterDataByTransactionId() {
    axios
      .get(`${url}/transactionService/transaction/${transactionId}`, {})
      .then((response) => {
        const data = response.data;
        var list = [data];
        setT1data(list);
        console.log(data);
      })
      .catch((err) => console.log("Something went wrong.", err));
  }
  function putData() {
    axios
      .put(`${url}/transactionService/transaction/${transactionId}`, {
        value: value,
        type: type,
        parentId: parentId,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log("Something went wrong.", err));
  }
  // useEffect(getData, []);
  const mystyle = {
    position: "absolute",
    bottom: "0",
    top: "0",
    background: "rgb(0, 0, 0)",
    background: "rgba(0, 0, 0, 0.5)" /* Black see-through */,
    color: "#f1f1f1",
    width: "100%",
    // transition: .5s ease,
    opacity: "1",
    color: "white",
    fontSize: "20px",
    padding: "20px",
    textAlign: "center",
    zIndex: "4",
  };
  const mystyle2 = {
    background: "rgb(211, 47, 47,0.2)",
    color: "#ffffff",
    width: "320px",
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={require("../public/IPL.png")}
          style={{
            height: "100vh",
            position: "fixed",
            background: "black",
            zIndex: "1",
          }}
          alt="logo"
        />
        <div style={mystyle}></div>
        <div
          className="container text-center"
          style={{ zIndex: "7", opacity: "0.9" }}
        >
          <div className="row justify-content-md-center">
            <div className="col-5">
              <div style={{ zIndex: "7" }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {t1data.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={t1data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
            <div className="col-5">
              <div style={{ zIndex: "7" }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns2.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {t2data
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                              >
                                {columns2.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {column.format &&
                                      typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={t2data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-3">
            <div className="col-2">
              <Stack direction="row" spacing={2}>
                {/* <Button color="secondary">Secondary</Button>
              <Button variant="contained" color="success">
                Success
              </Button> */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={getData}
                  style={mystyle2}
                >
                  Load Table 1
                </Button>
              </Stack>
            </div>
            <div className="col-2">
              <Stack direction="row " spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={getData2}
                  style={mystyle2}
                >
                  Load Table 2
                </Button>
              </Stack>
            </div>
          </div>
          <div className="row justify-content-center mt-3">
            <div className="col-3">
              <Stack direction="row" spacing={2}>
                {/* <Button color="secondary">Secondary</Button>
              <Button variant="contained" color="success">
                Success
              </Button> */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    putData();
                    console.log(transactionId, parentId, type, value);
                  }}
                  style={mystyle2}
                >
                  Add Transaction
                </Button>
              </Stack>
            </div>
            <div className="col-3">
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    filterDataByTransactionId();
                  }}
                  style={mystyle2}
                >
                  Get Transaction
                </Button>
              </Stack>
            </div>
          </div>
          <div className="row justify-content-center mt-3">
            <div className="col-4 d-flex justify-content-end">
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={filterData}
                  style={mystyle2}
                >
                  Filter Transaction on Type
                </Button>
              </Stack>
            </div>
            <div className="col-4">
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={getResult}
                  style={mystyle2}
                >
                  Get Sum of Connected Transaction
                </Button>
              </Stack>
            </div>
          </div>
          <div
            className="row mt-4"
            // style={{
            //   backgroundColor: "#ffffff",
            //   padding: "20px",
            //   paddingLeft: "0",
            //   paddingRight: "0",
            //   opacity: "0.9",
            //   width: "auto",
            // }}
          >
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": {
                  m: 1,
                  width: "25ch",
                  background: "#ffffff",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <div className="row justify-content-center">
                <div className="col-4">
                  <div>
                    <TextField
                      id="outlined-basic"
                      label="TransactionID"
                      variant="outlined"
                      placeholder="TransactionID"
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                  <div>
                    <TextField
                      id="outlined-basic"
                      label="Value"
                      variant="outlined"
                      placeholder="Value"
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div>
                    <TextField
                      id="outlined-basic"
                      label="Type"
                      variant="outlined"
                      placeholder="Type"
                      onChange={(e) => setType(e.target.value)}
                    />
                  </div>
                  <div>
                    <TextField
                      id="outlined-basic"
                      label="ParentID"
                      variant="outlined"
                      placeholder="ParentID"
                      onChange={(e) => setParentId(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Box>
          </div>
          <div className="row mt-4">
            <div>Total Transaction Sum</div>

            <div>{totalSum}</div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
