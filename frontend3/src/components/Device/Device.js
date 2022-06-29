import { useEffect, useState } from 'react'
import axios from 'axios'
import {Table, Button, Modal} from 'react-bootstrap'
import {Search} from 'react-bootstrap-icons'
import styles from './Device.module.scss'
import AddDevice from './AddDevice'
import UpdateDevice from './UpdateDevice'

export default function Device({tab}){

    const [deviceList, setDeviceList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteData, setDeleteData] = useState()
    const [updateData, setUpdateData] = useState()
    const [searchData, setSearchData] = useState()

    useEffect(() => { 
        const getDevice = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/device/')
            setDeviceList(res.data.results)
            // console.log(res)
            // resetName()
        }
        getDevice()
    },[update, tab])

    // useEffect( () => {
    //     axios.get('http://127.0.0.1:8000/api/area/')
    //     .then(function(res){
    //         setAreaList(res.data)
    //         getProvince(res.data[0].name, false)
    //     })
    // }, [tab])

    // useEffect(() => { 
    //     resetName()
    //     console.log('checl')
    // },[inputUpdate['pop']])

    
    // useEffect(() => { 
    //     axios.get('http://127.0.0.1:8000/api/area/')
    //     .then(function(res){
    //         setAreaList(res.data)
    //         getProvince(res.data[0].name, false)
    //     })
    //     },[update])

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/searchdevice/',{params:{'search': searchData}})
        .then(function(res){
            // console.log(res)
            setDeviceList(res.data.data)
        });
    },[searchData])

    const handleClose = () => {
        setShowDelete(false)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
    }
    const handleShowUpdate = (data) =>{
        // console.log('data', data)
        if (data.role === "AGG"){
            data['type'] = data.name.substring(0,2)
        }
        setShowUpdate(true)
        // setInputUpdate(0)
        // setInputUpdate(data)
        setUpdateData(data)
    }
    const handleShowDelete = () =>setShowDelete(true)

    // const getProvince = (data, br) => {
    //     axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
    //     .then(function(res){
    //         setProvinceList(res.data.data)
    //         if(!br){

    //             getBranch(res.data.data[0].name, false)
    //             if(res.data.data.length != 0){

    //                 setInput(prev => ({...prev, "province": res.data.data[0].id}))
    //             }
    //         }
    //     })
    // }
    
    // const getBranch = (data, br) => {
    //     axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
    //     .then(function(res){
    //         setBranchList(res.data.data)
    //         if(!br){

    //             getPopplus(res.data.data[0].name, false)
    //             if(res.data.data.length != 0){
    //             setInputUpdate(prev => ({...prev, "branch": res.data.data[0].id, "branch_name": res.data.data[0].name}))}
    //             if(res.data.data.length != 0){
                    
    //                 setInput(prev => ({...prev, "branch": res.data.data[0].id, "branch_name": res.data.data[0].name}))
    //             }
    //         }
    //     })
    // }

    // const getPopplus = (data, br) => {
    //     axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
    //     .then(function(res){
    //         setPopplusList(res.data.data)
    //         if(res.data.data.length != 0){
    //         setInputUpdate(prev => ({...prev, "popPlus": res.data.data[0].id, "popPlus_name": res.data.data[0].name}))}
            
    //         if(!br){
                
    //             if(res.data.data.length != 0){
    //                 getPop(res.data.data[0].name)
                    
    //                 setInput(prev => ({...prev, "popPlus": res.data.data[0].id, "popPlus_name": res.data.data[0].name}))
    //             } else {
    //                 setPopList([])
    //             }
    //         }
    //     })
    // }

    // const getPop = (data) => {
    //     axios.get('http://127.0.0.1:8000/api/poppopplus', {params:{'name': data}})
    //     .then(function(res){
    //         setPopList(res.data.data)
    //         if(res.data.data.length != 0){
    //         setInputUpdate(prev => ({...prev, "pop": res.data.data[0].id, "pop_name": res.data.data[0].name}))}
    //         if(res.data.data.length != 0){
                    
    //             setInput(prev => ({...prev, "pop": res.data.data[0].id, "pop_name": res.data.data[0].name}))
    //         }
    //     })
    // }

    // const getBrand = (data) => {
    //     axios.get('http://127.0.0.1:8000/api/branddevice/', {params:{'role': data}})
    //     .then(function(res){
    //         setBrandList(res.data.data)
    //     })
    // }

    // const handleChangeUpdate = (event) => {
    //     const name = event.target.name
    //     const value = event.target.value
    //     var r= inputUpdate['role']
    //     var n= inputUpdate['name']
    //     var b= inputUpdate['brand_name']
    //     var t= inputUpdate['type']
    //     var p= inputUpdate['pop']

    //     setInputUpdate(values => ({...values, [name]: value}))
    //     console.log("change", name, value)
    //     if( name == 'brand'){
    //         axios.get(`http://127.0.0.1:8000/api/brand/${value}/`)
    //         .then( (res) => {
    //             // console.log("brandname", res.data.name)
    //             setInputUpdate(values => ({...values, 'brand_name': res.data.name}))
    //             b = res.data.name
    //             axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
    //                 'role': r,
    //                 'name': n,
    //                 'brand': b,
    //                 'type': t,
    //                 'pop': p
    //             }})
    //             .then(function(res){
    //                 console.log("res", res.data)
    //                 console.log("input", inputUpdate)
    //                 setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //                 // setUpdate(prev => !prev)
    //             })
                
    //         })
    //     }

    //     if( name == 'type'){
    //         t = value
    //         axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
    //             'role': r,
    //             'name': n,
    //             'brand': b,
    //             'type': t,
    //             'pop': p
    //         }})
    //         .then(function(res){
    //             console.log("res", res.data)
    //             console.log("input", inputUpdate)
    //             setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //             // setUpdate(prev => !prev)
    //         })
    //     }

    //     if( name == 'pop'){
    //         p = value
    //         axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
    //             'role': r,
    //             'name': n,
    //             'brand': b,
    //             'type': t,
    //             'pop': p
    //         }})
    //         .then(function(res){
    //             console.log("res", res.data)
    //             console.log("input", inputUpdate)
    //             setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //             // setUpdate(prev => !prev)
    //         })
    //     }
    //     console.log("rn", rn)
    //     setRn(prev => !prev)
    // }

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

    // const handleUpdate = () => {
    //     console.log('inputUpdate', inputUpdate)
    //     axios({
    //         method: "put",
    //         url: `http://127.0.0.1:8000/api/device/${inputUpdate['id']}/`,
    //         data: inputUpdate,
    //         headers: { "Content-Type": "multipart/form-data" },
    //       })
    //       .then( (res) => {
    //         console.log('update', res)
    //         setUpdate(prev => !prev)
    //       }
    //       )
    //     setShowUpdate(false)
    // }

    // const resetName = () => {
    //     var r= inputUpdate['role']
    //     var n= inputUpdate['name']
    //     var b= inputUpdate['brand_name']
    //     var t= inputUpdate['type']
    //     var p= inputUpdate['pop']
    //     axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
    //             'role': r,
    //             'name': n,
    //             'brand': b,
    //             'type': t,
    //             'pop': p
    //         }})
    //         .then(function(res){
    //             // console.log("res", res.data)
    //             console.log("input", inputUpdate)
    //             setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //             // setUpdate(prev => !prev)
    //         })
    // }

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
                <AddDevice show={showAdd} setShow={setShowAdd} setUpdate={setUpdate} />
                
                {updateData?
                <UpdateDevice show={showUpdate} setShow={setShowUpdate} updateData={updateData} setUpdate={setUpdate} />
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