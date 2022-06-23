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
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [input, setInput] = useState({})
    const [inputUpdate, setInputUpdate] = useState({})

    useEffect(() => { 
        const getPopplus = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/popplus/')
            // console.log(res)
            setPopplusList(res.data)
        }
        getPopplus()
    },[update])

    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvice(res.data[0].name)
        })
        },[])
    useEffect(()=>{
        setInputUpdate(updateData)

        const tail1 = updateData['name'][updateData['name'].length - 4]
        const tail2 = updateData['name'].substring(updateData['name'].length - 3, updateData['name'].length)
        // console.log(tail1, tail2)
        setInputUpdate(values => ({...values, ['tail1']: tail1}))
        setInputUpdate(values => ({...values, ['tail2']: tail2}))
    },[updateData])
   
    const handleClose = () => {
        setShowAdd(false)
        setShowUpdate(false)
        setShowDelete(false)
        setInputUpdate(0)
    }
    const handleShowAdd = () => setShowAdd(true);
    const handleShowUpdate = () =>{
        setShowUpdate(true)

    }
    const handleShowDelete = () =>setShowDelete(true)

    const getProvice = (data) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            getBranch(res.data.data[0].name)
        })
    }
    
    const getBranch = (data) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
        .then(function(res){
            setBranchList(res.data.data)
            // console.log('branch list',branchList)
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
        setInputUpdate(values => ({...values, [name]: value}))
    }

    const updateBranch = (e) => {
        const value = e.target.value
        // console.log(value)
        axios.get('http://127.0.0.1:8000/api/branchname/', {params:{'name': value}})
        .then(function(res){
            // console.log(res.data.data[0].id)
            setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id}))
        })


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
        axios.delete(`http://127.0.0.1:8000/api/popplus/${deleteData}/`)
        .then(function (res) {
            setUpdate(prev => !prev)
          })
        .catch( (res) => {
            console.log(res)
        }

        )

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

                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Popplus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng:</label>
                                <select name='area' onChange={(e)=>{getProvice(e.target.value)}}>
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
                                <select name='branch' onChange={handleChange}>
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
                                <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" onChange={handleChange} required/>
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
                <Modal show={showUpdate} onHide={handleClose} onShow={()=>{getProvice(updateData.area_name); getBranch(updateData.province_name)}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal} >
                            <div>
                                <label>Vùng:</label>
                                <select defaultValue={updateData.area_name}  name='area' onChange={(e)=>{getProvice(e.target.value); handleChangeUpdate(e)}} >
                                    {areaList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                <select defaultValue={updateData.province_name} name='province' onChange={(e)=>{getBranch(e.target.value); handleChangeUpdate(e)}} >
                                    {provinceList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select defaultValue={updateData.branch_name} name='branch_name' onChange={(e)=>{handleChangeUpdate(e); updateBranch(e)}}>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Phần đuôi: </label>
                                <select name='tail1' onChange={handleChangeUpdate}>
                                    <option>-</option>
                                    <option value='P' selected={'P' == inputUpdate['tail1']}>P</option>
                                    <option value='M' selected={'M' == inputUpdate['tail1']}>M</option>
                                </select>
                                <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" onChange={handleChangeUpdate}
                                defaultValue={inputUpdate['tail2']}/>
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