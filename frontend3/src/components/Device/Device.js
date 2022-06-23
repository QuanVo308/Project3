import { useEffect, useState } from 'react'
import axios from 'axios'
import {Table, Button, Modal} from 'react-bootstrap'
import {Search} from 'react-bootstrap-icons'
import styles from './Device.module.scss'

export default function Device({tab}){

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
    const [searchData, setSearchData] = useState()
    const [rn, setRn] = useState(false)

    useEffect(() => { 
        const getDevice = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/device/')
            setDeviceList(res.data)
            // console.log(res)
            // resetName()
        }
        getDevice()
    },[update])
    useEffect( () => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].name, false)
        })
    }, [tab])
    useEffect(() => { 
        resetName()
        console.log('checl')
    },[inputUpdate['pop']])

    
    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].name, false)
        })
        },[update])

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/searchdevice/',{params:{'search': searchData}})
        .then(function(res){
            // console.log(res)
            setDeviceList(res.data.data)
        });
    },[searchData])

    const handleClose = () => {
        setShowAdd(false)
        setShowUpdate(false)
        setShowDelete(false)
        setInput(0)
        setInputUpdate(0)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
        getProvince(1, false)
    }
    const handleShowUpdate = (data) =>{
        console.log('data', data)
        data['type'] = data.name.substring(0,2)
        setShowUpdate(true)
        setInputUpdate(0)
        setInputUpdate(data)
        setUpdateData(data)
    }
    const handleShowDelete = () =>setShowDelete(true)

    const getProvince = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            if(!br){

                getBranch(res.data.data[0].name, false)
                if(res.data.data.length != 0){

                    setInput(prev => ({...prev, "province": res.data.data[0].id}))
                }
            }
        })
    }
    
    const getBranch = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
        .then(function(res){
            setBranchList(res.data.data)
            if(!br){

                getPopplus(res.data.data[0].name, false)
                if(res.data.data.length != 0){
                setInputUpdate(prev => ({...prev, "branch": res.data.data[0].id, "branch_name": res.data.data[0].name}))}
                if(res.data.data.length != 0){
                    
                    setInput(prev => ({...prev, "branch": res.data.data[0].id, "branch_name": res.data.data[0].name}))
                }
            }
        })
    }

    const getPopplus = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            if(res.data.data.length != 0){
            setInputUpdate(prev => ({...prev, "popPlus": res.data.data[0].id, "popPlus_name": res.data.data[0].name}))}
            
            if(!br){
                
                if(res.data.data.length != 0){
                    getPop(res.data.data[0].name)
                    
                    setInput(prev => ({...prev, "popPlus": res.data.data[0].id, "popPlus_name": res.data.data[0].name}))
                } else {
                    setPopList([])
                }
            }
        })
    }

    const getPop = (data) => {
        axios.get('http://127.0.0.1:8000/api/poppopplus', {params:{'name': data}})
        .then(function(res){
            setPopList(res.data.data)
            if(res.data.data.length != 0){
            setInputUpdate(prev => ({...prev, "pop": res.data.data[0].id, "pop_name": res.data.data[0].name}))}
            if(res.data.data.length != 0){
                    
                setInput(prev => ({...prev, "pop": res.data.data[0].id, "pop_name": res.data.data[0].name}))
            }
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
        const value = event.target.value
        var r= inputUpdate['role']
        var n= inputUpdate['name']
        var b= inputUpdate['brand_name']
        var t= inputUpdate['type']
        var p= inputUpdate['pop']

        setInputUpdate(values => ({...values, [name]: value}))
        console.log("change", name, value)
        if( name == 'brand'){
            axios.get(`http://127.0.0.1:8000/api/brand/${value}/`)
            .then( (res) => {
                // console.log("brandname", res.data.name)
                setInputUpdate(values => ({...values, 'brand_name': res.data.name}))
                b = res.data.name
                axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
                    'role': r,
                    'name': n,
                    'brand': b,
                    'type': t,
                    'pop': p
                }})
                .then(function(res){
                    console.log("res", res.data)
                    console.log("input", inputUpdate)
                    setInputUpdate(prev => ({...prev, 'name': res.data.name}))
                    // setUpdate(prev => !prev)
                })
                
            })
        }

        if( name == 'type'){
            t = value
            axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
                'role': r,
                'name': n,
                'brand': b,
                'type': t,
                'pop': p
            }})
            .then(function(res){
                console.log("res", res.data)
                console.log("input", inputUpdate)
                setInputUpdate(prev => ({...prev, 'name': res.data.name}))
                // setUpdate(prev => !prev)
            })
        }

        if( name == 'pop'){
            p = value
            axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
                'role': r,
                'name': n,
                'brand': b,
                'type': t,
                'pop': p
            }})
            .then(function(res){
                console.log("res", res.data)
                console.log("input", inputUpdate)
                setInputUpdate(prev => ({...prev, 'name': res.data.name}))
                // setUpdate(prev => !prev)
            })
        }
        console.log("rn", rn)
        setRn(prev => !prev)
    }

    const handleAdd = () => {
        const formData = new FormData()
        Object.entries(input).map( ([key, value]) => {
            formData.append(key, value)
            
        })
        console.log('input', input)
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

    const handleUpdate = () => {
        console.log('inputUpdate', inputUpdate)
        // axios({
        //     method: "put",
        //     url: `http://127.0.0.1:8000/api/pop/${inputUpdate['id']}/`,
        //     data: inputUpdate,
        //     headers: { "Content-Type": "multipart/form-data" },
        //   })
        //   .then( (res) => {
        //     console.log('update', res)
        //     setUpdate(prev => !prev)
        //   }
        //   )
        setShowUpdate(false)
    }

    const resetName = () => {
        var r= inputUpdate['role']
        var n= inputUpdate['name']
        var b= inputUpdate['brand_name']
        var t= inputUpdate['type']
        var p= inputUpdate['pop']
        axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
                'role': r,
                'name': n,
                'brand': b,
                'type': t,
                'pop': p
            }})
            .then(function(res){
                // console.log("res", res.data)
                console.log("input", inputUpdate)
                setInputUpdate(prev => ({...prev, 'name': res.data.name}))
                // setUpdate(prev => !prev)
            })
    }

    return(
        <div>
            <div className={styles.AddSearch}>
                <div className={styles.btnAdd}>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Device</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' value={searchData} onChange={(e) => {setSearchData(e.target.value)}}/>
                    <Search />
                </div>
            </div>
            <div>
                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Device</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
                                <select name='area' onChange={(e)=>{getProvince(e.target.value)}}>
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
                                <label>Role:</label>
                                <select name='role' onChange={(e)=>{getBrand(e.target.value); handleChange(e)}}>
                                    <option>-</option>
                                    {['AGG','OLT','SW-BB','POWER'].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            {input.role == 'AGG' && <div>
                                <label>Type:</label>
                                <select name='type' onChange={handleChange}>
                                    <option>-</option>
                                    {['DI','DA','CE'].map(data => (
                                    <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>}
                            
                            
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
                <Modal show={showUpdate} onHide={handleClose} onShow={()=>{getProvince(updateData.area_name, false);  getBrand(updateData.role)}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
                                <select defaultValue={updateData.area_name} name='area' onChange={(e)=>{getProvince(e.target.value); handleChangeUpdate(e)}}>
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
                                        <option value={data.id}>{data.name}</option>
                                    ))}
                                </select>
                                
                            </div>
                            
                            
                            <div>
                                <label>Role:</label>
                                <select defaultValue={updateData.role} name='role' onChange={(e)=>{getBrand(e.target.value); handleChangeUpdate(e)}} disabled>
                                    {['AGG','OLT','SW-BB','POWER'].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            {inputUpdate.role == 'AGG' && <div>
                                <label>Type:</label>
                                <select defaultValue={updateData.type} name='type' onChange={handleChangeUpdate}>
                                    {['DI','DA','CE'].map(data => (
                                    <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>}
                            <div>
                                <label>Brand:</label>
                                <select  name='brand' onChange={handleChangeUpdate}>
                                    {brandList.map(data => (
                                        <option value={data.id} selected={data.name==inputUpdate.brand_name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Name:</label>
                                <input defaultValue={inputUpdate.name} type='text' value={inputUpdate.name} disabled/>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
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