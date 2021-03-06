import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap'
import styles from './Popplus.module.scss'


function AddPopplus({show, setShow, setUpdate}) {

    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [input, setInput] = useState({})

    useEffect( () => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].name)
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
            setInput(prev => ({...prev, ['branch_name']: res.data.data[0].name, ['branch']: res.data.data[0].id}))
        })
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

    function checkIPOctet(se) {
        if(se > 255){
            return 255
        }
        if(se < 0){
            return 0
        }
        return se
    }

    const handleClose = () => {
        setShow(false)
        setInput(0)
    }

    const handleChange = (event) => {
        const name = event.target.name
        var value 
        if (name === 'octet2_ip_MGMT' || name === 'octet2_ip_OSPF_MGMT' || name === 'octet3_ip_MGMT'){
            value = checkIPOctet(event.target.value)
        } else if (name === 'tail2') {
            // console.log('check', name)
            value = checkTail2(event.target.value)
            // console.log('check', value)
        } else {
            value = event.target.value
        }
        setInput(values => ({...values, [name]: value}))
    }

    const handleAdd = () => {
        // console.log(input)
        const formData = new FormData()
        Object.entries(input).map( ([key, value]) => {
            formData.append(key, value)
        })
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/popplus/",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
            // console.log(response);
            setUpdate(prev => !prev)
        })

        setShow(false)
        setInput(0)
    }

    return ( 
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Popplus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={styles.formModal}>
                        <div>
                            <label>V??ng:</label>
                            <select name='area' onChange={(e)=>{getProvince(e.target.value, false)}}>
                                {areaList.map(data => (
                                    <option key={data.id} value={data.id}>{data.name}</option>
                                ))}
                            </select>    
                        </div>
                        <div>
                            <label>T???nh:</label>
                            <select name='province' onChange={(e)=>{getBranch(e.target.value)}}>
                                {provinceList.map(data => (
                                    <option key={data.id} value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Chi nh??nh:</label>
                            <select name='branch' onChange={handleChange}>
                                {branchList.map(data => (
                                    <option key={data.id} value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Ph???n ??u??i: </label>
                            <select name='tail1' onChange={handleChange}>
                                <option>-</option>
                                <option value='P'>P</option>
                                <option value='M'>M</option>
                            </select>
                            <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" value={input['tail2']} onChange={handleChange}/>
                        </div>
                        <div>
                            <label>Area OSPF:</label>
                            <select name='area_OSPF' onChange={handleChange}>
                                <option>-</option>
                                {[1,2,3,4,5,6,7,8,9].map(data => (
                                    <option key={data} value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Octet2 IP OSPF MGMT:</label>
                            <input type="number"  value={input['octet2_ip_OSPF_MGMT']} name='octet2_ip_OSPF_MGMT' onChange={handleChange} />
                        </div>
                        <div>
                            <label>Octet2 IP MGMT:</label>
                            <input type="number" value={input['octet2_ip_MGMT']} name='octet2_ip_MGMT' onChange={handleChange} />
                        </div>
                        <div>
                            <label>Octet3 IP MGMT:</label>
                            <input type="number" value={input['octet3_ip_MGMT']} name='octet3_ip_MGMT' onChange={handleChange} />
                        </div>
                        <div>
                            <label>vlan PPPoE:</label>
                            <select name='vlan_PPPoE' onChange={handleChange}>
                                <option>-</option>
                                {[30,31,32,33,34,35,36,37,38,39].map(data => (
                                    <option key={data} value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={(handleClose)}>
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

export default AddPopplus;