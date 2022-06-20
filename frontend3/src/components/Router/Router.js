import {Routes, Route} from 'react-router-dom';
import Popplus from '../Popplus/Popplus';
import Pop from '../Pop/Pop';
import Device from '../Device/Device';


export default function Router() {
    return(
        <Routes>
            <Route exact path='/' element={<Popplus />} />
            <Route path='/popplus' element={<Popplus />} />
            <Route path='/pop' element={<Pop />} />
            <Route path='/device' element={<Device />} />
        </Routes>
    )
}