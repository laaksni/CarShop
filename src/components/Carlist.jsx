import { useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
//import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const gridRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("https://carrestservice-carshop.rahtiapp.fi/cars")
            .then((response) => response.json())
            .then((data) => setCars(data._embedded.cars));
    };

    const handleFieldChange = (event) => {
        setSelectedCar(event.data);
    };

    const handleAddCar = () => {
        // TODO: Implementoi uuden auton lisääminen API:lle
        setOpenDialog(false);
        setSnackbarMessage("Auto lisätty onnistuneesti!");
        setOpenSnackbar(true);
    };

    const handleDeleteCar = () => {
        // TODO: Implementoi valitun auton poistaminen API:lle
        setSelectedCar(null);
        setSnackbarMessage("Auto poistettu onnistuneesti!");
        setOpenSnackbar(true);
    };

    const handleEditCar = () => {
        // TODO: Implementoi valitun auton muokkaaminen API:lle
        setOpenDialog(false);
        setSnackbarMessage("Auto muokattu onnistuneesti!");
        setOpenSnackbar(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const [columnDefs] = useState([
        { field: "brand" },
        { field: "model" },
        { field: "color" },
        { field: "fuel" },
        { field: "modelYear" },
        { field: "price" },
    ]);

    return (
        <>
            <Stack mt={2} direction="row" spacing={2} justifyContent="center" alignItems="center">
                {/* Hae- ja suodatuskentät */}
                {/* TODO: Implementoi hakukenttä ja suodatustoiminnot */}
                <TextField placeholder="Hae" />

                {/* Lisää auto -painike */}
                <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                    Lisää auto
                </Button>

                {/* Muokkaa auto -painike */}
                <Button variant="outlined" disabled={!selectedCar} onClick={handleEditCar}>
                    Muokkaa autoa
                </Button>

                {/* Poista auto -painike */}
                <Button variant="outlined" disabled={!selectedCar} onClick={handleDeleteCar}>
                    Poista auto
                </Button>
            </Stack>

            {/* Autotaulukko */}
            <div className="ag-theme-material" style={{ height: "500px", width: "185%", margin: "auto" }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columnDefs}
                    onGridReady={(params) => (gridRef.current = params.api)}
                    rowSelection="single"
                    onSelectionChanged={() => {
                        const selectedRows = gridRef.current.getSelectedRows();
                        setSelectedCar(selectedRows[0]);
                    }}
                />
            </div>

            {/* Lisää, muokkaa ja poista auto -dialogi */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{selectedCar ? "Muokkaa autoa" : "Lisää auto"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="brand"
                        label="Merkki"
                        type="text"
                        fullWidth
                        value={selectedCar ? selectedCar.brand : ""}
                        onChange={(e) => handleFieldChange("brand", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="model"
                        label="Malli"
                        type="text"
                        fullWidth
                        value={selectedCar ? selectedCar.model : ""}
                        onChange={(e) => handleFieldChange("model", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="color"
                        label="Väri"
                        type="text"
                        fullWidth
                        value={selectedCar ? selectedCar.color : ""}
                        onChange={(e) => handleFieldChange("color", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="fuel"
                        label="Polttoaine"
                        type="text"
                        fullWidth
                        value={selectedCar ? selectedCar.fuel : ""}
                        onChange={(e) => handleFieldChange("fuel", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="year"
                        label="Valmistusvuosi"
                        type="number"
                        fullWidth
                        value={selectedCar ? selectedCar.year : ""}
                        onChange={(e) => handleFieldChange("year", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Hinta"
                        type="number"
                        fullWidth
                        value={selectedCar ? selectedCar.price : ""}
                        onChange={(e) => handleFieldChange("price", e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Peruuta</Button>
                    {selectedCar ? (
                        <Button onClick={handleEditCar}>Tallenna muutokset</Button>
                    ) : (
                        <Button onClick={handleAddCar}>Lisää auto</Button>
                    )}
                    {selectedCar && (
                        <Button onClick={handleDeleteCar} color="error">
                            Poista auto
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar onnistumisviesteille */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </>
    );
}
