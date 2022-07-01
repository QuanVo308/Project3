import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap'
import styles from './Pop.module.scss'

function AddPop({show, setShow, setUpdate}) {

    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [popplusList, setPopplusList] = useState([])
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
            setInput(prev => ({...prev, ['province']: res.data.data[0].id}))
            getBranch(res.data.data[0].id)
        })
    }

    const getBranch = (data) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'id': data}})
        .then(function(res){
            setBranchList(res.data.data)
            setInput(prev => ({...prev, ['branch_name']: res.data.data[0].name, ['branch']: res.data.data[0].id}))
            getPopplus(res.data.data[0].id)
        })
    }

    const getPopplus = (data) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'id': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            if(res.data.data.length !== 0){
                setInput(prev => ({...prev, ['popPlus']: res.data.data[0].id}))

            }
        })
    }

    const handleClose = () => {
        setShow(false)
        setInput([])
    }

    function checkSequenceRing(se) {
        if(se > 63){
            return 63
        }
        if(se < 1){
            return 1
        }
        return se
    }

    function checkTail2(tail) {
        // console.log(tail)
        if(tail < 1){
            return 1
        }
        if(tail > 999){
            return 999
        }
        return tail
    }

    const handleChange = (event) => {
        const name = event.target.name
        var value
        if (name === 'sequence_ring'){
            value = checkSequenceRing(event.target.value)
        } else if (name ==='tail2') {
            value = checkTail2(event.target.value)
        } else {
            value = event.target.value
        }
        setInput(values => ({...values, [name]: value}))
    }
    
    const handleAdd = () => {
        console.log(input)
        const formData = new FormData()
        Object.entries(input).map( ([key, value]) => {
            formData.append(key, value)
        })
        console.log("check", formData)
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/pop/",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(function (response) {
            console.log(response);
            setUpdate(prev => !prev)
          })
          .catch( (res,err) => {
            console.log(err)
          })

        setShow(false)
    }

    return ( 
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Pop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={styles.formModal}>
                        <div>
                            <label>Vùng: </label>
                            <select name='area' onChange={(e)=>{getProvince(e.target.value, false)}}>
                                {areaList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Tỉnh:</label>
                            <select name='province' onChange={(e)=>{getBranch(e.target.value); handleChange(e)}}>
                                {provinceList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Chi nhánh:</label>
                            <select name='branch' onChange={(e)=>{getPopplus(e.target.value); handleChange(e)}}>
                                {branchList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Popplus:</label>
                            <select name='popPlus' onChange={handleChange}>
                                {popplusList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Phần đuôi: </label>
                            <select name='tail1' onChange={handleChange}>
                                <option>-</option>
                                {['P','M','K','V','B'].map(data => (
                                <option value={data}>{data}</option>
                                ))}
                            </select>
                            <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" value={input['tail2']} onChange={handleChange}/>
                        </div>
                        <div>
                            <label>Metro:</label>
                            <select name='metro' onChange={handleChange}>
                                <option>-</option>
                                {['MP01','MP02','MP03','MP04','MP05','MP06','MP07','MP08','MP09','MP10','MP11','MP12','MP13'].map(data => (
                                    <option value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Sequence Ring:</label>
                            <input type="number" name='sequence_ring' placeholder='01->63' value={input['sequence_ring']} min="1" max="63" onChange={handleChange} />
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

export default AddPop;