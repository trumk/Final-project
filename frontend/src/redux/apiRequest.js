import axios from 'axios'
import { getProjectsFailed, getProjectsStart, getProjectsSuccess } from './projectSlice';


const BACKEND_URL = "http://localhost:5000/";

export const getAllProjects = async (dispatch)=>{
    dispatch(getProjectsStart());
    try{
        const res = await axios.get(`${BACKEND_URL}`)
        dispatch(getProjectsSuccess(res.data));
    }catch(err){
        dispatch(getProjectsFailed());
    }
}