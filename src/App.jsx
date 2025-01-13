import { createContext, useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginNRegister from './components/Auth/LoginNRegister'
import Calendar from './components/Calendar/Calendar'
import Sidebar from './components/Sidebar'
import Notepad from './components/Diary/Notepad'
import { Alert, Snackbar } from '@mui/material'

export const SnackbarContext = createContext(null)

function App() {
  const [snackBarProps, setSnackBarProps] = useState({
    openSnackBar: false,
    snackBarMessage: '',
    snackBarVarient: ''
  })

  return (
   <>
      <SnackbarContext.Provider value={{
          snackBarProps,
          setSnackBarProps
        }}>
        {/* Setting up routes */}
        <Routes >
          <Route path='/' element={<Landing />} />
          <Route path='/auth' element={<LoginNRegister />} />
          <Route element={<Sidebar />} >
            <Route path='/calendar' element={<Calendar dob="2000-01-01" />} />
            <Route path='/notepad/:date' element={<Notepad />} />
          </Route>
          {/* Redirect to login by default */}
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
  
        {/* Snackbar for alerts */}
        <Snackbar open={snackBarProps.openSnackBar} autoHideDuration={3000} onClose={
          () => setSnackBarProps((prev) => ({ ...prev, openSnackBar: false }))
        } anchorOrigin={{ vertical: 'top', horizontal: 'center' }} className='text-white '>
          <Alert
            onClose={() => setSnackBarProps((prev) => ({ ...prev, openSnackBar: false }))}
            severity={snackBarProps.snackBarVarient}
            variant="filled"
            sx={{ width: '100%' }}
            className='text-4xl'
          >
            {snackBarProps.snackBarMessage}
          </Alert>
        </Snackbar>
      </SnackbarContext.Provider>
   </>
  )
}

export default App
