import { useEffect, useState } from 'react'
import axios from 'axios'
import {Table, Button, Modal} from 'react-bootstrap'
import styles from './Device.module.scss'

export default function Device(){

    const [deviceList, setDeviceList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteData, setDeleteData] = useState()
    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [popplusList, setPopplusList] = useState([])
    const [popList, setPopList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [input, setInput] = useState({})
    const [updateData, setUpdateData] = useState()
    const [inputUpdate, setInputUpdate] = useState({})

    useEffect(() => { 
        const getDevice = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/device/')
            setDeviceList(res.data)
            console.log(res)
            resetName()
        }
        getDevice()
    },[update])

    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvice(res.data[0].name)
        })
        },[update])

    const handleClose = () => {
        setShowAdd(false)
        setShowUpdate(false)
        setShowDelete(false)
        setInput(0)
    }
    const handleShowAdd = () => setShowAdd(true);
    const handleShowUpdate = (data) =>{
        setShowUpdate(true)
        setInputUpdate(0)
        setUpdateData(data)
    }
    const handleShowDelete = () =>setShowDelete(true)

    const getProvice = (data) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            getBranch(res.data.data[0].name)
        })
    }
    
    const getBranch = (data) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
        .then(function(res){
            setBranchList(res.data.data)
            getPopplus(res.data.data[0].name)
        })
    }

    const getPopplus = (data) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            getPop(res.data.data[0].name)
        })
    }

    const getPop = (data) => {
        axios.get('http://127.0.0.1:8000/api/poppopplus', {params:{'name': data}})
        .then(function(res){
            setPopList(res.data.data)
        })
    }

    const getBrand = (data) => {
        axios.get('http://127.0.0.1:8000/api/branddevice/', {params:{'role': data}})
        .then(function(res){
            setBrandList(res.data.data)
        })
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInput(values => ({...values, [name]: value}))
    }

    const handleChangeUpdate = (event) => {
        const name = event.target.name

        // axios.get('http://127.0.0.1:8000/api/popname/', {params:{
        //     'popPlus': b,
        //     'tail1': t1,
        //     'tail2': t2 
        // }})
        //     .then(function(res){
        //         // console.log(res.data)
        //         setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        // })

        
        // setInputUpdate(values => ({...values, [name]: value}))
    }

    const handleAdd = () => {
        const formData = new FormData()
        Object.entries(input).map( ([key, value]) => {
            formData.append(key, value)
            
        })
        console.log(input)
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/device/",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(function (response) {
            // console.log(response);
            setUpdate(prev => !prev)
          })

        setShowAdd(false)
    }

    const handleDelete = () => {
        // console.log(deleteData)
        axios.delete(`http://127.0.0.1:8000/api/device/${deleteData}/`)
        .then(function (res) {
            console.log(res);
            setUpdate(prev => !prev)
          })
        .catch( (res) => {
            console.log(res)
        })

        setShowDelete(false)
    }

    const resetName = () => {
        // axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'popPlus': inputUpdate['popPlus_name'],
        //     'tail1': inputUpdate['tail1'],
        //     'tail2': inputUpdate['tail2']}})
        // .then(function(res){
        //     // console.log(res.data)
        //     setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        // })
    }

    return(
        <div>
            <div>
                <div>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Device</Button>
                </div>
                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Device</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
                                <select name='area' onChange={(e)=>{getProvice(e.target.value)}}>
                                    {areaList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                <select name='province' onChange={(e)=>{getBranch(e.target.value)}}>
                                    {provinceList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                                
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select name='branch' onChange={(e)=>{getPopplus(e.target.value)}}>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Popplus:</label>
                                <select name='popp' onChange={(e)=>{getPop(e.target.value)}}>
                                    {popplusList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Pop:</label>
                                <select name='pop' onChange={handleChange}>
                                    {popList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                                
                            </div>
                            <div>
                                <label>Type:</label>
                                <select name='type' onChange={handleChange}>
                                    <option>-</option>
                                    {['DI','DA','CE'].map(data => (
                                    <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Role:</label>
                                <select name='role' onChange={(e)=>{getBrand(e.target.value); handleChange(e)}}>
                                    <option>-</option>
                                    {['AGG','OLT','SW-BB','POWER'].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Brand:</label>
                                <select name='brand' onChange={handleChange}>
                                    <option>-</option>
                                    {brandList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                    </Modal.Footer>
                </Modal>
                
                {updateData?
                <Modal show={showUpdate} onHide={handleClose} onShow={()=>{getProvice(updateData.area_name); getBranch(updateData.province_name); getPopplus(updateData.popPlus_name); getPop(updateData.pop_name); getBrand(updateData.role)}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
                                <select defaultValue={updateData.area_name} name='area' onChange={(e)=>{getProvice(e.target.value); handleChangeUpdate(e)}}>
                                    {areaList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                <select defaultValue={updateData.province_name} name='province' onChange={(e)=>{getBranch(e.target.value); handleChangeUpdate(e)}}>
                                    {provinceList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                                
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select defaultValue={updateData.branch_name} name='branch' onChange={(e)=>{getPopplus(e.target.value); handleChangeUpdate(e)}}>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Popplus:</label>
                                <select defaultValue={updateData.popPlus_name} name='popp' onChange={(e)=>{getPop(e.target.value); handleChangeUpdate(e)}}>
                                    {popplusList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Pop:</label>
                                <select defaultValue={updateData.pop_name} name='pop' onChange={handleChangeUpdate}>
                                    {popList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                                
                            </div>
                            <div>
                                <label>Type:</label>
                                <select defaultValue={updateData.type} name='type' onChange={handleChangeUpdate}>
                                    {['DI','DA','CE'].map(data => (
                                    <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Role:</label>
                                <select defaultValue={updateData.role} name='role' onChange={(e)=>{getBrand(e.target.value); handleChangeUpdate(e)}}>
                                    {['AGG','OLT','SW-BB','POWER'].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Brand:</label>
                                <select defaultValue={updateData.brand_name} name='brand' onChange={handleChangeUpdate}>
                                    {brandList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Update
                    </Button>
                    </Modal.Footer>
                </Modal>
                :null}

                <Modal show={showDelete} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Confirm!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có muốn xóa dữ liệu này?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className={styles.table}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Ip</th>
                            <th>Pop</th>
                            <th>Brand</th> 
                            <th>Subnet</th>
                            <th>Gateway</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {deviceList.map(data => (
                        <tbody key={data.id}>
                        <tr>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{data.role}</td>
                            <td>{data.ip }</td>
                            <td>{data.pop_name }</td>
                            <td>{data.brand_name}</td>
                            <td>{data.subnet}</td>
                            <td>{data.gateway}</td>
                            <td>
                                <Button variant="success" onClick={()=>{handleShowUpdate(data)}}> Update</Button>
                                <Button variant="danger" onClick={()=>{handleShowDelete(); setDeleteData(data.id)}}> Delete</Button>
                            </td>
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </div>
        </div>
    )
}