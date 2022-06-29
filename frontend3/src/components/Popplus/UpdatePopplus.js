import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap'
import styles from './Popplus.module.scss'


function UpdatePopplus({show, setShow, updateData, setUpdate}) {

    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [inputUpdate, setInputUpdate] = useState([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
        })
    }, [])
    
    useEffect( () => {
        let data = updateData
        // console.log("updateData", updateData)
        setInputUpdate(0)
        const tail1 = data['name'][data['name'].length - 4]
        const tail2 = data['name'].substring(data['name'].length - 3, data['name'].length)
        setInputUpdate(data)
        getProvince(data.area,true)
        getBranch(data.province, true)
        setInputUpdate(values => ({...values, ['tail1']: tail1, ['tail2']: tail2}))
    }, [show])

    const getProvince = (data, br) => {
        // console.log("1", br)
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'id': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            // console.log("2", br)
            if (!br){
                getBranch(res.data.data[0].id, false)
                setInputUpdate(prev => ({...prev, 'province_name':res.data.data[0].name, 'province':res.data.data[0].id}))
                // console.log("check", data)
            }
            // br = false
        })
    }
    
    const getBranch = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'id': data}})
        .then(function(res){
            setBranchList(res.data.data)
            // setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id, ['branch_name']: res.data.data[0].name}))
            if(!br) {
                setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id, ['branch_name']: res.data.data[0].name}))

                axios.get('http://127.0.0.1:8000/api/poppname/', {params:{'branch': res.data.data[0].id,
                'tail1': inputUpdate['tail1'],
                'tail2': inputUpdate['tail2']}})
                .then(function(res){
                    // console.log("check", res.data)
                    setInputUpdate(prev => ({...prev, 'name': res.data.name}))
                })
            }
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
        console.log("updateData", updateData)
        console.log("inputUpdate", inputUpdate)
    }

    const handleChangeUpdate = (event) => {
        const name = event.target.name
        var value
        if (name == 'octet2_ip_MGMT' || name == 'octet2_ip_OSPF_MGMT' || name == 'octet3_ip_MGMT'){
            value = checkIPOctet(event.target.value)
        } else if (name == 'tail2') {
            // console.log('check', name)
            value = checkTail2(event.target.value)
            // console.log('check', value)
        } else {
            value = event.target.value
        }

        var b= inputUpdate['branch']
        var t1 = inputUpdate['tail1']
        var t2 = inputUpdate['tail2']
        if (name == 'tail2'){
            t2 = value 
        }

        if (name == 'tail1'){
            t1 = value 
        }
        if (name == 'branch_name'){
            b = value 
        }

        axios.get('http://127.0.0.1:8000/api/poppname/', {params:{
            'branch': b,
            'tail1': t1,
            'tail2': t2 
        }})
            .then(function(res){
                // console.log(res.data)
                setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        })   
        setInputUpdate(values => ({...values, [name]: value}))
    }

    // const updateBranch = (e) => {
    //     const value = e.target.value
    //     // console.log(value)
    //     axios.get('http://127.0.0.1:8000/api/branchname/', {params:{'id': value}})
    //     .then(function(res){
    //         if(res.data.data.length != 0){
    //             setInputUpdate(values => ({...values, ['branch_name']: res.data.data[0].name}))
    //         }
    //     })
    // }

    const handleUpdate = () => {
        console.log(updateData)
        console.log(inputUpdate)
        // axios({
        //     method: "put",
        //     url: `http://127.0.0.1:8000/api/popplus/${inputUpdate['id']}/`,
        //     data: inputUpdate,
        //     headers: { "Content-Type": "multipart/form-data" },
        //   })
        //   .then( (res) => {
        //     setUpdate(prev => !prev)
        //   }
        //   )
        // setShow(false)
        // axios.get(`http://127.0.0.1:8000/api/updatepop/`)
        // axios.get(`http://127.0.0.1:8000/api/updatedevice/`)
    }

    return ( 
        <div>
            {inputUpdate?
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                <Modal.Title>Update Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={styles.formModal} >
                        <div>
                            <label>Vùng:</label>
                            <select defaultValue={updateData.area_name}  name='area' onChange={(e)=>{getProvince(e.target.value, false); handleChangeUpdate(e)}} >
                                {areaList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Tỉnh:</label>
                            <select defaultValue={updateData.province_name} name='province' onChange={(e)=>{getBranch(e.target.value, false); handleChangeUpdate(e)}} >
                                {provinceList.map(data => (
                                    <option value={data.id} selected={data.name == inputUpdate.province_name} >{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Chi nhánh:</label>
                            <select defaultValue={updateData.branch_name} name='branch' onChange={(e)=>{handleChangeUpdate(e)}}>
                                {branchList.map(data => (
                                    <option value={data.id} >{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Phần đuôi: </label>
                            <select name='tail1' onChange={handleChangeUpdate}>
                                <option value='P' selected={'P' == inputUpdate['tail1']}>P</option>
                                <option value='M' selected={'M' == inputUpdate['tail1']}>M</option>
                            </select>
                            <input type="number" name='tail2' placeholder='001 -> 999' min="1"  max="999" onChange={handleChangeUpdate}
                            defaultValue={inputUpdate['tail2']}/>
                        </div>
                        <div>
                            <label>Name:</label>
                            <input type='text' value={updateData.name} disabled/>
                        </div> 
                        <div>
                            <label>Area OSPF:</label>
                            <select defaultValue={updateData.area_OSPF} name='area_OSPF' onChange={handleChangeUpdate}>
                                {[1,2,3,4,5,6,7,8,9].map(data => (
                                    <option value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Octet2 IP OSPF MGMT:</label>
                            <input defaultValue={updateData.octet2_ip_OSPF_MGMT}  type="number" name='octet2_ip_OSPF_MGMT' onChange={handleChangeUpdate} />
                        </div>
                        <div>
                            <label>Octet2 IP MGMT:</label>
                            <input defaultValue={updateData.octet2_ip_MGMT}  type="number" name='octet2_ip_MGMT' onChange={handleChangeUpdate} />
                        </div>
                        <div>
                            <label>Octet3 IP MGMT:</label>
                            <input defaultValue={updateData.octet3_ip_MGMT}  type="number" name='octet3_ip_MGMT' onChange={handleChangeUpdate} />
                        </div>
                        <div>
                            <label>vlan PPPoE:</label>
                            <select defaultValue={updateData.vlan_PPPoE} name='vlan_PPPoE' onChange={handleChangeUpdate}>
                                {[30,31,32,33,34,35,36,37,38,39].map(data => (
                                    <option value={data}>{data}</option>
                                ))}
                            </select>
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

export default UpdatePopplus;