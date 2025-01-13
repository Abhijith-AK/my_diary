import React, { useEffect, useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { deleteEntryAPI, getEntryAPI, saveEntryAPI, updateEntryAPI } from '../../services/allAPI';
import { SnackbarContext } from '../../App';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import bookLoader from '../../assets/bookLoader.gif'

const Notepad = () => {
    const date = useParams();  // Extract the 'date' parameter from the URL
    const [entry, setEntry] = useState('');
    const [updateData, setUpdateData] = useState({});
    const [saved, setSaved] = useState(false);
    const [deletable, setDeletable] = useState(false);
    const [isEntryExists, setIsEntryExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);  // State for delete dialog
    const maxChar = 900;
    const { setSnackBarProps } = useContext(SnackbarContext);

    const user = JSON.parse(sessionStorage.getItem("user"));

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
        ]
    };

    // Fetching the entry based on user and date
    const getEntry = async () => {
        setLoading(true);
        try {
            const response = await getEntryAPI();
            const entryData = response.data.find(entry => entry.userId === user.id && date.date === entry.date);
            if (entryData) {
                setUpdateData(entryData);
                setEntry(entryData.quill);  // Set the entry content to state
                setIsEntryExists(true);
                setDeletable(true);
                setSaved(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchEntry = async () => {
            await getEntry();
        };
        fetchEntry();
    }, [date.date, deletable]);

    const handleChange = (content) => {
        setEntry(content);
        if (content !== updateData.quill) { // Ensure changes are made
            setSaved(false);
        }
        else {
            setDeletable(false); // No content to delete
        }
    };

    const charCount = entry?.replace(/<[^>]*>/g, '').length;

    // Handle key press event to restrict input, except for backspace
    const handleKeyDown = (e) => {
        if (charCount >= maxChar && e.key !== "Backspace") {
            e.preventDefault();
        }
    };

    const handleSave = async () => {
        setSaved(false);
        if (entry.trim() && entry !== updateData.quill) { // Ensure content and changes
            setLoading(true);
            if (!isEntryExists) {
                const entryDetails = {
                    "userId": user.id,
                    "quill": entry,
                    "date": date.date
                };
                try {
                    const response = await saveEntryAPI(entryDetails);
                    if (response.status === 201) {
                        setSaved(true);
                        setSnackBarProps({
                            snackBarVarient: 'success',
                            snackBarMessage: 'Entry saved successfully!',
                            openSnackBar: true,
                        });
                        setDeletable(true)
                    }
                } catch (error) {
                    console.log(error);
                    setSnackBarProps({
                        snackBarVarient: 'error',
                        snackBarMessage: 'Failed to save entry',
                        openSnackBar: true,
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                const updatedEntry = { ...updateData, "quill": entry };
                try {
                    const response = await updateEntryAPI(updatedEntry);
                    if (response.status === 200) {
                        setSaved(true);
                        setSnackBarProps({
                            snackBarVarient: 'success',
                            snackBarMessage: 'Entry updated successfully!',
                            openSnackBar: true,
                        });
                        setDeletable(true)
                    }
                } catch (error) {
                    console.log(error);
                    setSnackBarProps({
                        snackBarVarient: 'error',
                        snackBarMessage: 'Failed to update entry',
                        openSnackBar: true,
                    });
                } finally {
                    setLoading(false);
                }
            }
        } else {
            setSnackBarProps({
                snackBarVarient: 'warning',
                snackBarMessage: 'No changes to save',
                openSnackBar: true,
            });
        }
    };

    const handleDelete = async () => {
        if (entry.trim()) {  // Only delete if there is content
            setLoading(true);
            try {
                const response = await deleteEntryAPI(updateData.id);
                if (response.status === 200) {
                    console.log("Deleted");
                    setEntry('');  // Clear the editor after deletion
                    setIsEntryExists(false);
                    setSnackBarProps({
                        snackBarVarient: 'success',
                        snackBarMessage: 'Entry deleted successfully!',
                        openSnackBar: true,
                    });
                    setDeletable(false)
                    setSaved(false)
                }
            } catch (error) {
                console.log(error);
                setSnackBarProps({
                    snackBarVarient: 'error',
                    snackBarMessage: 'Failed to delete entry',
                    openSnackBar: true,
                });
            } finally {
                setLoading(false);
            }
        } else {
            setSnackBarProps({
                snackBarVarient: 'warning',
                snackBarMessage: 'No content to delete',
                openSnackBar: true,
            });
        }
        setOpenDeleteDialog(false)
    };

    return (
        <div className='h-full relative'>
            <div className='flex justify-between p-3 items-center'>
                <h1 className='text-lg md:text-3xl'>Date: {date.date}</h1>
                <div className="controls flex">
                    <button
                        onClick={handleSave}
                        className={`px-3 py-1 m-3 text-white ${saved ? 'bg-green-300 pointer-events-none' : 'bg-green-500'} rounded`}
                        disabled={loading || !(entry.trim() && entry !== updateData.quill)}
                    >
                        {loading ? 'Saving...' : (saved ? 'Saved' : 'Save')}
                    </button>
                    <button
                        onClick={() => setOpenDeleteDialog(true)}  // Open the confirmation dialog
                        className={`px-3 py-1 m-3 text-white ${!deletable ? 'bg-red-300 pointer-events-none' : 'bg-red-500'} rounded`}
                        disabled={loading || !deletable}
                    >
                        {'Delete'}
                    </button>
                </div>
            </div>

            {/* Quill Text Editor */}
            {loading ? (
                <div className='flex w-screen h-screen justify-center items-center'><img src={bookLoader} alt='loading...' /></div>
            ) : (
                <ReactQuill
                    className='h-[50vh] md:h-[75vh]'
                    modules={modules}
                    value={entry}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            )}

            {/* Character Counter Section */}
            <div
                className={`text-right mt-2 ${charCount >= maxChar ? 'text-red-500' : 'text-gray-500'} absolute bottom-5 right-10`}
            >
                {charCount}/{maxChar}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Delete Entry</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this entry?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}
                        color="success"
                        variant="contained"
                        style={{ margin: '0 10px' }}
                        size="large"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'green',
                                borderColor: '#e57373',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    
                    <Button onClick={handleDelete}
                        color="primary"
                        variant="contained"
                        style={{ margin: '0 10px' }}
                        size="large"
                        sx={{
                            backgroundColor: '#ff4081',
                            '&:hover': {
                                backgroundColor: '#f50057',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Notepad;
