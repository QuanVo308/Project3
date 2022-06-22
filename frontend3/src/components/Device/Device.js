import { useEffect, useState } from 'react'
import axios from 'axios'
import {Table, Button, Modal} from 'react-bootstrap'
import styles from './Device.module.scss'

export default function Device(){

    const [deviceList, setDeviceList] = useState([])
    useEffect(() => { 
        const getDevice = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/device/')
            setDeviceList(res.data)
            // console.log(res)
        }
        getDevice()
    },[])

    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(false);

    const handleClose = () => {setShowAdd(false);setShowUpdate(false);setShowDelete(false)}
    const handleShowAdd = () => setShowAdd(true);
    const handleShowUpdate = () =>setShowUpdate(true)
    const handleShowDelete = () =>setShowDelete(true)

    const [areaList, setAreaList] = useState([])
    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
        })
        },[])

    const [provinceList, setProvinceList] = useState([])
    const getProvice = (data) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            
        })
    }
    
    const [branchList, setBranchList] = useState([])
    const getBranch = (data) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
        .then(function(res){
            // console.log(res)
            setBranchList(res.data.data)
        })
    }

    const [popplusList, setPopplusList] = useState([])
    const getPopplus = (data) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
        .then(function(res){
            setPopplusList(res.data.data)
        })
    }

    const [popList, setPopList] = useState([])
    const getPop = (data) => {
        // const data = e.target.value
        axios.get('http://127.0.0.1:8000/api/poppopplus', {params:{'name': data}})
        .then(function(res){
            setPopList(res.data.data)
        })
    }

    const [brandList, setBrandList] = useState([])

    const getBrand = (data) => {
        axios.get('http://127.0.0.1:8000/api/branddevice/', {params:{'role': data}})
        .then(function(res){
            setBrandList(res.data.data)
        })
    }

    const [input, setInput] = useState({})
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInput(values => ({...values, [name]: value}))
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
            console.log(response);
          })

        setShowAdd(false)
    }

    const handleDelete = () => {
        // console.log(deleteData)
        axios.delete(`http://127.0.0.1:8000/api/device/${deleteData}/`)
        .then(function (res) {
            console.log(res);
          })

        setShowDelete(false)
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
                                    <option>-</option>
                                    {areaList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                <select name='province' onChange={(e)=>{getBranch(e.target.value)}}>
                                    <option>-</option>
                                    {provinceList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                                
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select name='branch' onChange={(e)=>{getPopplus(e.target.value)}}>
                                    <option>-</option>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Popplus:</label>
                                <select name='popp' onChange={(e)=>{getPop(e.target.value)}}>
                                    <option>-</option>
                                    {popplusList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Pop:</label>
                                <select name='pop' onChange={handleChange}>
                                    <option>-</option>
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

                <Modal show={showUpdate} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body></Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Update
                    </Button>
                    </Modal.Footer>
                </Modal>

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
                                <Button variant="success" onClick={()=>{handleShowUpdate()}}> Update</Button>
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