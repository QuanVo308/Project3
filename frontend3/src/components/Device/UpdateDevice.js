import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal, Form} from 'react-bootstrap'
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
        // console.log(updateData)
        setInputUpdate(updateData)
        getProvince(updateData.area_name)
        getBranch(updateData.province)
        getPopplus(updateData.branch)
        getPop(updateData.popPlus)
        getBrand(updateData.role)
    },[show])

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
                if(res.data.data.length !== 0){
                setInputUpdate(prev => ({...prev, "branch": res.data.data[0].id, "branch_name": res.data.data[0].name}))}
            }
        })
    }

    const getPopplus = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'id': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            if(res.data.data.length !== 0){
            setInputUpdate(prev => ({...prev, "popPlus": res.data.data[0].id, "popPlus_name": res.data.data[0].name}))}
            
            if(!br){
                
                if(res.data.data.length !== 0){
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
            if(res.data.data.length !== 0){
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
        if( name === 'tnew'){
            axios.get('http://127.0.0.1:8000/api/powerdeviceupdate/', {params:{
                'tnew': event.target.value,
                'pop': inputUpdate['pop'],
            }})
            .then( (res) => {
                // console.log(res)
                setInputUpdate(values => ({...values, 'subnet': res.data.subnet, 'gateway': res.data.gateway}))
            })
        }

        setInputUpdate(values => ({...values, [name]: value})) 
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
                    // console.log("input", inputUpdate)
                    setInputUpdate(prev => ({...prev, 'name': res.data.name}))
                    // setUpdate(prev => !prev)
                })
        }

    const handleUpdate = () => {
        console.log('inputUpdate', inputUpdate)
        axios({
            method: "put",
            url: `http://127.0.0.1:8000/api/device/${inputUpdate['id']}/`,
            data: inputUpdate,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then( (res) => {
            console.log('update', res)
            setUpdate(prev => !prev)
          }
          )
        setShow(false)
    }

    const handleClose = () => {
        setShow(false)
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
                            <select name='area' onChange={(e)=>{getProvince(e.target.value, false); handleChangeUpdate(e)}}>
                                {areaList.map(data => (
                                    <option key={data.id} value={data.id} selected={data.name===inputUpdate.area_name}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Tỉnh:</label>
                            <select name='province' onChange={(e)=>{getBranch(e.target.value, false); handleChangeUpdate(e)}}>
                                {provinceList.map(data => (
                                    <option key={data.id} value={data.id} selected={data.name===inputUpdate.province_name}>{data.name}</option>
                                ))}
                            </select>
                            
                        </div>
                        <div>
                            <label>Chi nhánh:</label>
                            <select name='branch' onChange={(e)=>{getPopplus(e.target.value, false); handleChangeUpdate(e)}}>
                                {branchList.map(data => (
                                    <option key={data.id} value={data.id} selected={data.name===inputUpdate.branch_name} >{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Popplus:</label>
                            <select name='popp' onChange={(e)=>{getPop(e.target.value); handleChangeUpdate(e)}}>
                                {popplusList.map(data => (
                                    <option key={data.id} value={data.id} selected={data.name===inputUpdate.popPlus_name}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Pop:</label>
                            <select name='pop' onChange={handleChangeUpdate}>
                                {popList.map(data => (
                                    <option key={data.id} value={data.id} selected={data.name===inputUpdate.pop_name}>{data.name}</option>
                                ))}
                            </select>
                            
                        </div>
                        
                        
                        <div>
                            <label>Role:</label>
                            <select defaultValue={inputUpdate.role} name='role' onChange={(e)=>{getBrand(e.target.value); handleChangeUpdate(e)}} disabled>
                                {['AGG','OLT','SW-BB','POWER'].map(data => (
                                    <option key={data} value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        {inputUpdate.role === 'AGG' && <div>
                            <label>Type:</label>
                            <select defaultValue={inputUpdate.type} name='type' onChange={handleChangeUpdate}>
                                {['DI','DA','CE'].map(data => (
                                <option key={data} value={data}>{data}</option>
                                ))}
                            </select>
                        </div>}
                        {inputUpdate.role === 'POWER' && <div>
                            <label>IP Type:</label>
                            <Form onChange={handleChangeUpdate}>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check inline label="New" name="tnew" value='1' type={type} id={`inline-${type}-1`} defaultChecked={updateData.tnew === 1 ? true : false} />
                                        <Form.Check inline label="Old" name="tnew" value='0' type={type} id={`inline-${type}-2`} defaultChecked={updateData.tnew === 0 ? true : false} />
                                    </div>
                                ))}
                            </Form>
                        </div>}
                        <div>
                            <label>Brand:</label>
                            <select defaultValue={inputUpdate.brand_name} name='brand' onChange={handleChangeUpdate}>
                                {brandList.map(data => (
                                    <option key={data.id} value={data.id} selected={data.name===inputUpdate.brand_name}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Name:</label>
                            <input className={styles.deviceName} defaultValue={inputUpdate.name} type='text' value={inputUpdate.name} disabled/>
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