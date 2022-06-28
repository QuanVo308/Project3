import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap'
import styles from './Device.module.scss'


function UpdateDevice({show, setShow, updateData, setUpdate}) {

    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [popplusList, setPopplusList] = useState([])
    const [popList, setPopList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [inputUpdate, setInputUpdate] = useState([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
        })
    }, [])

    useEffect(()=>{
        setInputUpdate(updateData)

        getProvince(updateData.area_name)
        getBranch(updateData.province)
        getPopplus(updateData.branch)
        getPop(updateData.popPlus)
        getBrand(updateData.role)
    },[updateData])

    const getProvince = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'id': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            if(!br){
                getBranch(res.data.data[0].id, false)
            }
        })
    }

    const getBranch = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'id': data}})
        .then(function(res){
            setBranchList(res.data.data)
            if(!br){

                getPopplus(res.data.data[0].id, false)
                if(res.data.data.length != 0){
                setInputUpdate(prev => ({...prev, "branch": res.data.data[0].id, "branch_name": res.data.data[0].name}))}
            }
        })
    }

    const getPopplus = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'id': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            if(res.data.data.length != 0){
            setInputUpdate(prev => ({...prev, "popPlus": res.data.data[0].id, "popPlus_name": res.data.data[0].name}))}
            
            if(!br){
                
                if(res.data.data.length != 0){
                    getPop(res.data.data[0].id)
                }
            }
        })
    }

    useEffect(()=>{
        resetName()
    },[inputUpdate.pop,inputUpdate.type,inputUpdate.brand])

    const getPop = (data) => {
        axios.get('http://127.0.0.1:8000/api/poppopplus', {params:{'id': data}})
        .then(function(res){
            setPopList(res.data.data)
            if(res.data.data.length != 0){
            setInputUpdate(prev => ({...prev, "pop": res.data.data[0].id, "pop_name": res.data.data[0].name}))}
        })
    }

    const getBrand = (data) => {
        axios.get('http://127.0.0.1:8000/api/branddevice/', {params:{'role': data}})
        .then(function(res){
            setBrandList(res.data.data)
        })
    }

    const handleChangeUpdate = (event) => {
        const name = event.target.name
        const value = event.target.value
        // var r= inputUpdate['role']
        // var n= inputUpdate['name']
        // var b= inputUpdate['brand']
        // var t= inputUpdate['type']
        // var p= inputUpdate['pop']

        setInputUpdate(values => ({...values, [name]: value}))
        console.log("change", name, value)
        resetName()
        // axios.get('http://127.0.0.1:8000/api/devicename/', {params:{
        //         'role': r,
        //         'name': n,
        //         'brand': b,
        //         'type': t,
        //         'pop': p
        //     }})
        //     .then(function(res){
        //         // console.log("res", res.data)
        //         console.log("input", inputUpdate)
        //         setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        //         setUpdate(prev => !prev)
        //     })

        // if( name == 'brand'){
        //     axios.get(`http://127.0.0.1:8000/api/brand/${value}/`)
        //     .then( (res) => {
        //         // console.log("brandname", res.data.name)
        //         setInputUpdate(values => ({...values, 'brand_name': res.data.name}))
        //         b = res.data.id
        //         axios.get('http://127.0.0.1:8000/api/devicename/', {params:{
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
                
        //     })
        // }

        // if( name == 'type'){
        //     t = value
        //     axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
        //         'role': r,
        //         'name': n,
        //         'brand': b,
        //         'type': t,
        //         'pop': p
        //     }})
        //     .then(function(res){
        //         console.log("res", res.data)
        //         console.log("input", inputUpdate)
        //         setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        //         // setUpdate(prev => !prev)
        //     })
        // }

        // if( name == 'pop'){
        //     p = value
        //     axios.get('http://127.0.0.1:8000/api/devicename/', {params:{'pop': inputUpdate['pop'],
        //         'role': r,
        //         'name': n,
        //         'brand': b,
        //         'type': t,
        //         'pop': p
        //     }})
        //     .then(function(res){
        //         console.log("res", res.data)
        //         console.log("input", inputUpdate)
        //         setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        //         // setUpdate(prev => !prev)
        //     })
        // // console.log("rn", rn)
        // // setRn(prev => !prev)
    }

    const resetName = () => {
            var r= inputUpdate['role']
            var n= inputUpdate['name']
            var b= inputUpdate['brand']
            var t= inputUpdate['type']
            var p= inputUpdate['pop']
            axios.get('http://127.0.0.1:8000/api/devicename/', {params:{
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

    const handleUpdate = () => {
        console.log('inputUpdate', inputUpdate)
        // axios({
        //     method: "put",
        //     url: `http://127.0.0.1:8000/api/device/${inputUpdate['id']}/`,
        //     data: inputUpdate,
        //     headers: { "Content-Type": "multipart/form-data" },
        //   })
        //   .then( (res) => {
        //     console.log('update', res)
        //     setUpdate(prev => !prev)
        //   }
        //   )
        // setShow(false)
    }

    const handleClose = () => {
        setShow(false)
        setInputUpdate([])
    }

    return ( 
        <div>
            {inputUpdate?
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Update Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={styles.formModal}>
                        <div>
                            <label>Vùng: </label>
                            <select defaultValue={inputUpdate.area_name} name='area' onChange={(e)=>{getProvince(e.target.value, false); handleChangeUpdate(e)}}>
                                {areaList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Tỉnh:</label>
                            <select defaultValue={inputUpdate.province_name} name='province' onChange={(e)=>{getBranch(e.target.value, false); handleChangeUpdate(e)}}>
                                {provinceList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                            
                        </div>
                        <div>
                            <label>Chi nhánh:</label>
                            <select defaultValue={inputUpdate.branch_name} name='branch' onChange={(e)=>{getPopplus(e.target.value, false); handleChangeUpdate(e)}}>
                                {branchList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Popplus:</label>
                            <select defaultValue={inputUpdate.popPlus_name} name='popp' onChange={(e)=>{getPop(e.target.value); handleChangeUpdate(e)}}>
                                {popplusList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Pop:</label>
                            <select defaultValue={inputUpdate.pop_name} name='pop' onChange={handleChangeUpdate}>
                                {popList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                            
                        </div>
                        
                        
                        <div>
                            <label>Role:</label>
                            <select defaultValue={inputUpdate.role} name='role' onChange={(e)=>{getBrand(e.target.value); handleChangeUpdate(e)}} disabled>
                                {['AGG','OLT','SW-BB','POWER'].map(data => (
                                    <option value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        {inputUpdate.role == 'AGG' && <div>
                            <label>Type:</label>
                            <select defaultValue={inputUpdate.type} name='type' onChange={handleChangeUpdate}>
                                {['DI','DA','CE'].map(data => (
                                <option value={data}>{data}</option>
                                ))}
                            </select>
                        </div>}
                        <div>
                            <label>Brand:</label>
                            <select defaultValue={inputUpdate.brand_name} name='brand' onChange={handleChangeUpdate}>
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
        </div>
    );
}

export default UpdateDevice;