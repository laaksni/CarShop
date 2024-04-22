import { useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCars, setFilteredCars] = useState([]);
    const gridRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filteredCars = cars.filter((car) =>
            car.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCars(filteredCars);
    }, [cars, searchTerm]);

    const fetchData = () => {
        fetch("https://carrestservice-carshop.rahtiapp.fi/cars")
            .then((response) => response.json())
            .then((data) => setCars(data._embedded.cars));
    };

    const handleFieldChange = (field, value) => {
        setSelectedCar({
            ...selectedCar,
            [field]: value
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddCar = () => {

        const newCar = {
            brand: selectedCar.brand,
            model: selectedCar.model,
            color: selectedCar.color,
            fuel: selectedCar.fuel,
            modelYear: selectedCar.year,
            price: selectedCar.price
        };

        fetch("https://carrestservice-carshop.rahtiapp.fi/cars", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCar)
        })
            .then(response => {
                if (response.ok)
                    fetchData();
                    setSnackbarMessage("Auto lisätty onnistuneesti!");
                    setOpenSnackbar(true);
                    setOpenDialog(false);
                })
            .catch((error) => console.error("Virhe lisättäessä autoa:", error));
    };

    const handleDeleteCar = () => {
        if (!selectedCar) {
            return;
        }

        const carId = selectedCar.id;

        fetch(`https://carrestservice-carshop.rahtiapp.fi/cars/${carId}`, {
            method: "DELETE"
        })
            .then(() => {
                fetchData();
                setSelectedCar(null);
                setSnackbarMessage("Auto poistettu onnistuneesti!");
                setOpenSnackbar(true);
            })
            .catch((error) => console.error("Virhe poistettaessa autoa:", error));
    };

    const handleEditCar = () => {
        if (!selectedCar) {
            return;
        }

        const carId = selectedCar.id;
        const updatedCar = {
            brand: selectedCar.brand,
            model: selectedCar.model,
            color: selectedCar.color,
            fuel: selectedCar.fuel,
            modelYear: selectedCar.year,
            price: selectedCar.price
        };

        fetch(`https://carrestservice-carshop.rahtiapp.fi/cars/${carId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedCar)
        })
            .then(() => {
                fetchData();
                setSnackbarMessage("Auto muokattu onnistuneesti!");
                setOpenSnackbar(true);
                setOpenDialog(false);
            })
            .catch((error) => console.error("Virhe muokattaessa autoa:", error));
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
                <TextField placeholder="Hae"
                    value={searchTerm}
                    onChange={handleSearchChange} />

                <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                    Lisää auto
                </Button>

                <Button variant="outlined" disabled={!selectedCar} onClick={handleEditCar}>
                    Muokkaa autoa
                </Button>

                <Button variant="outlined" disabled={!selectedCar} onClick={handleDeleteCar}>
                    Poista auto
                </Button>
            </Stack>

            <div className="ag-theme-material" style={{ height: "500px", width: "185%", margin: "auto" }}>
                <AgGridReact
                    rowData={filteredCars}
                    columnDefs={columnDefs}
                    onGridReady={(params) => (gridRef.current = params.api)}
                    rowSelection="single"
                    onSelectionChanged={() => {
                        const selectedRows = gridRef.current.getSelectedRows();
                        setSelectedCar(selectedRows[0]);
                    }}
                />
            </div>

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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </>
    );
}
