import commonAPI from "./commonAPI"
import SERVERURL from "./serverURL"

// create user API
export const createUserAPI = async (userDetails) => {
    return await commonAPI('POST', `${SERVERURL}/users`, userDetails)
}

// get userDetails API
export const getUserAPI = async () => {
    return await commonAPI('GET', `${SERVERURL}/users`, "")
}

// save entry API
export const saveEntryAPI = async (entryDetails) => {
    return await commonAPI('POST', `${SERVERURL}/entries`, entryDetails)
}

// get entry API
export const getEntryAPI = async () => {
    return await commonAPI('GET', `${SERVERURL}/entries`, "")
}

// update entry API
export const updateEntryAPI = async (entryDetails) => {
    return await commonAPI('PUT', `${SERVERURL}/entries/${entryDetails.id}`, entryDetails, "")
}

// delete entry API
export const deleteEntryAPI = async (id) => {
    return await commonAPI('DELETE', `${SERVERURL}/entries/${id}`, {}, "")
}



