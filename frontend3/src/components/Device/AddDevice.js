import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal, Form } from 'react-bootstrap'
import styles from './Device.module.scss'


function AddDevice({show, setShow, setUpdate}) {

    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [popplusList, setPopplusList] = useState([])
    const [popList, setPopList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [input, setInput] = useState({})

    useEffect( () => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].id)
        })
    }, [show])

    const getProvince = (data) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'id': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            getBranch(res.data.data[0].id)
        })
    }

    const getBranch = (data) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'id': data}})
        .then(function(res){
            setBranchList(res.data.data)
            getPopplus(res.data.data[0].id)
        })
    }

    const getPopplus = (data) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'id': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            getPop(res.data.data[0].id, false)
        })
    }

    const getPop = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/poppopplus', {params:{'id': data}})
        .then(function(res){
            setPopList(res.data.data)
            if(!br&res.data.data.length != 0){
                setInput(prev => ({...prev, ['pop']: res.data.data[0].id}))
            }
        })
    }

    const getBrand = (data) => {
        axios.get('http://127.0.0.1:8000/api/branddevice/', {params:{'role': data}})
        .then(function(res){
            setBrandList(res.data.data)
        })
    }

    const handleClose = () => {
        setShow(false)
        setInput([])
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInput(values => ({...values, [name]: value}))
    }

    const handleAdd = () => {
        if(typeof(input.tnew) === 'undefined'){
            setInput(values => ({...values, ['tnew']: 1}))
        }
        console.log(input)
        const formData = new FormData()
        Object.entries(input).map( ([key, value]) => {
            formData.append(key, value)
            
        })
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/device/",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(function (response) {
            console.log(response)
            setUpdate(prev => !prev)
          })
          setShow(false)
    }
    
    return ( 
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={styles.formModal}>
                        <div>
                            <label>Vùng: </label>
                            <select name='area' onChange={(e)=>{getProvince(e.target.value)}}>
                                {areaList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Tỉnh:</label>
                            <select name='province' onChange={(e)=>{getBranch(e.target.value)}}>
                                {provinceList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                            
                        </div>
                        <div>
                            <label>Chi nhánh:</label>
                            <select name='branch' onChange={(e)=>{getPopplus(e.target.value)}}>
                                {branchList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Popplus:</label>
                            <select name='popp' onChange={(e)=>{getPop(e.target.value)}}>
                                {popplusList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Pop:</label>
                            <select name='pop' onChange={handleChange}>
                                {popList.map(data => (
                                    <option value={data.id}>{data.name}</option>
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
                        {input.role == 'POWER' && <div>
                            <label>IP Type:</label>
                            <Form onChange={handleChange}>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check inline label="New" name="tnew" value='1' type={type} id={`inline-${type}-1`} defaultChecked='true' />
                                        <Form.Check inline label="Old" name="tnew" value='0' type={type} id={`inline-${type}-2`}/>
                                    </div>
                                ))}
                            </Form>
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
        </div>
    );
}

export default AddDevice;