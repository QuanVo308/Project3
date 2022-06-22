import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import styles from './Popplus.module.scss'

export default function Popplus(){

    const [popplusList, setPopplusList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState();
    const [updateData, setUpdateData] = useState();
    const [areaList, setAreaList] = useState([])


    useEffect(() => { 
        const getPopplus = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/popplus/')
            // console.log(res)
            setPopplusList(res.data)
        }
        getPopplus()
        // console.log("update", updateData)
        console.log(areaList, updateData)
    },[update, updateData])


   

    const handleClose = () => {setShowAdd(false);setShowUpdate(false);setShowDelete(false)}
    const handleShowAdd = () => setShowAdd(true);
    const handleShowUpdate = () =>setShowUpdate(true)
    const handleShowDelete = () =>setShowDelete(true)

    
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

    const [input, setInput] = useState({})
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInput(values => ({...values, [name]: value}))
    }

    const [inputUpdate, setInputUpdate] = useState({})
    useEffect(()=>{
        setInputUpdate(updateData)
    },[updateData])
    const handleChangeUpdate = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInputUpdate(values => ({...values, [name]: value}))
    }

    const handleAdd = () => {
        console.log(input)
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

          setShowAdd(false)
    }

    const handleDelete = () => {
        // console.log(deleteData)
        axios.delete(`http://127.0.0.1:8000/api/popplus/${deleteData}/`)
        .then(function (res) {
            // console.log(res);
            setUpdate(prev => !prev)
          })

          setShowDelete(false)
    }

    const handleUpdate = () => {
        console.log(inputUpdate)
    }

    return(
        <div>
            <div>
                <div>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Popplus</Button>
                </div>
                {/* {showAddPopplus?<AddPopplus data={showAddPopplus}/>:null} */}
                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Popplus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng:</label>
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
                                <select name='branch' onChange={handleChange}>
                                    <option>-</option>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Phần đuôi: </label>
                                <select name='tail1' onChange={handleChange}>
                                    <option>-</option>
                                    <option value='P'>P</option>
                                    <option value='M'>M</option>
                                </select>
                                <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" onChange={handleChange}/>
                            </div>
                            <div>
                                <label>Area OSPF:</label>
                                <select name='area_OSPF' onChange={handleChange}>
                                    <option>-</option>
                                    {[1,2,3,4,5,6,7,8,9].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Octet2 IP OSPF MGMT:</label>
                                <input type="number" name='octet2_ip_OSPF_MGMT' onChange={handleChange} />
                            </div>
                            <div>
                                <label>Octet2 IP MGMT:</label>
                                <input type="number" name='octet2_ip_MGMT' onChange={handleChange} />
                            </div>
                            <div>
                                <label>Octet3 IP MGMT:</label>
                                <input type="number" name='octet3_ip_MGMT' onChange={handleChange} />
                            </div>
                            <div>
                                <label>vlan PPPoE:</label>
                                <select name='vlan_PPPoE' onChange={handleChange}>
                                    <option>-</option>
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
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                    </Modal.Footer>
                </Modal>
                
                {updateData?
                <Modal show={showUpdate} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng:</label>
                                {/* <input type='text' defaultValue={updateData.area_name} disabled/> */}
                                <select  name='area' onChange={(e)=>{getProvice(e.target.value)}}>
                                    <option>0</option>
                                    {/* <option selected={true}>123</option> */}
                                    {areaList.map(data => (
                                        data.name == updateData.area_name ? 
                                        <option value={data.name} selected={true}>{data.name}</option> :
                                        <option value={data.name}>{data.name}</option>

                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                {/* <input type='text' defaultValue={updateData.province_name} onClick={()=>{getBranch(updateData.province_name)}}/> */}
                                <select name='province' onChange={(e)=>{getBranch(e.target.value)}}>
                                    {provinceList.map(data => (
                                        data.name == updateData.province_name ?
                                        <option value={data.name} selected={true}>{data.name}</option> :
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select defaultValue={updateData.branch_name} name='branch' onChange={handleChange}>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Name:</label>
                                <input type='text' defaultValue={updateData.name} disabled/>
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
                                <input defaultValue={updateData.octet2_ip_OSPF_MGMT} type="number" name='octet2_ip_OSPF_MGMT' onChange={handleChangeUpdate} />
                            </div>
                            <div>
                                <label>Octet2 IP MGMT:</label>
                                <input defaultValue={updateData.octet2_ip_MGMT} type="number" name='octet2_ip_MGMT' onChange={handleChangeUpdate} />
                            </div>
                            <div>
                                <label>Octet3 IP MGMT:</label>
                                <input defaultValue={updateData.octet3_ip_MGMT} type="number" name='octet3_ip_MGMT' onChange={handleChangeUpdate} />
                            </div>
                            <div>
                                <label>vlan PPPoE:</label>
                                <select defaultValue={updateData.vlan_PPPoE} name='vlan_PPPoE' onChange={handleChangeUpdate}>
                                    <option>-</option>
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
                            <th>area_OSPF</th>
                            <th>octet2_ip_OSPF_MGMT</th>
                            <th>octet2_ip_MGMT </th>
                            <th>octet3_ip_MGMT </th>
                            <th>vlan_PPPoE </th>
                            <th>branch</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {popplusList.map(data => (
                        <tbody key={data.id}>
                        <tr>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{data.area_OSPF}</td>
                            <td>{data.octet2_ip_OSPF_MGMT}</td>
                            <td>{data.octet2_ip_MGMT}</td>
                            <td>{data.octet3_ip_MGMT}</td>
                            <td>{data.vlan_PPPoE}</td>
                            <td>{data.branch_name}</td>
                            <td>
                                <Button variant="success" onClick={()=>{handleShowUpdate(); setUpdateData(data);}}> Update</Button>
                                <Button variant="danger" onClick={()=>{handleShowDelete(); setDeleteData(data.id);}}> Delete</Button>
                            </td>
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </div>
        </div>
    )
}