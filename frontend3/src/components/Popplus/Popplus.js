import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import {ArrowClockwise, Search} from 'react-bootstrap-icons'
import styles from './Popplus.module.scss'

export default function Popplus(tab){

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
    const [searchData, setSearchData] = useState()

    useEffect( () => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].name, false)
        })
    }, [tab])

    useEffect(() => { 
        const getPopplus = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/popplus/')
            // console.log(res)
            setPopplusList(res.data)
            resetName()
        }
        getPopplus()
        // console.log("check2", inputUpdate)
    },[update])

    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].name)
        })
        },[])

    useEffect(()=>{
        // resetName()
    },[inputUpdate])

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

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/searchpopp/',{params:{'search': searchData}})
        .then(function(res){
            console.log(res)
            setPopplusList(res.data.data)
        });
    },[searchData])

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
        setShowAdd(false)
        setShowUpdate(false)
        setShowDelete(false)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
        getProvince(1, false)
    }
    const handleShowUpdate = (data) =>{
        setShowUpdate(true)
        setInputUpdate(0)
        setUpdateData(data)
        const tail1 = data['name'][data['name'].length - 4]
        const tail2 = data['name'].substring(data['name'].length - 3, data['name'].length)
        // console.log("check1", data.province_name)
        setInputUpdate(data)
        getProvince(data.area_name, true)
        getBranch(data.province_name)
        // console.log(tail1, tail2)
        // console.log(data)
        setInputUpdate(values => ({...values, ['tail1']: tail1, ['tail2']: tail2}))
        setUpdate(prev => !prev)

    }
    const handleShowDelete = () =>setShowDelete(true)

    const getProvince = (data, br) => {
        console.log("1", br)
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            console.log("2", br)
            if (!br){
                getBranch(res.data.data[0].name, true)
                console.log("check", data)
            }
            br = false
            // setInputUpdate(prev => ({...prev, 'province_name':res.data.data[0].name}))
        })
    }
    
    const getBranch = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
        .then(function(res){
            setBranchList(res.data.data)
            // setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id, ['branch_name']: res.data.data[0].name}))
            if(br) {
                setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id, ['branch_name']: res.data.data[0].name}))
            }

            setInput(prev => ({...prev, ['branch_name']: res.data.data[0].name, ['branch']: res.data.data[0].id}))

            axios.get('http://127.0.0.1:8000/api/poppname/', {params:{'branch': res.data.data[0].name,
            'tail1': inputUpdate['tail1'],
            'tail2': inputUpdate['tail2']}})
            .then(function(res){
                // console.log("check", res.data)
                setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        })
            // console.log('branch list',branchList)
        })
    }

    const handleChange = (event) => {
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
        setInput(values => ({...values, [name]: value}))
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

        var b= inputUpdate['branch_name']
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
        })
        setShowDelete(false)
    }

    const handleUpdate = () => {
        console.log(inputUpdate)
        axios({
            method: "put",
            url: `http://127.0.0.1:8000/api/popplus/${inputUpdate['id']}/`,
            data: inputUpdate,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then( (res) => {
            // console.log('update', res)
            setUpdate(prev => !prev)
          }
          )
        setShowUpdate(false)
        axios.get(`http://127.0.0.1:8000/api/updatepop/`)
        axios.get(`http://127.0.0.1:8000/api/updatedevice/`)
        setUpdateData([])

    }

    const resetName = () => {
        axios.get('http://127.0.0.1:8000/api/poppname/', {params:{'branch': inputUpdate['branch_name'],
        'tail1': inputUpdate['tail1'],
        'tail2': inputUpdate['tail2']}})
        .then(function(res){
            // console.log(res.data)
            setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        })
    }

    return(
        <div>
            
            <div className={styles.AddSearch}>
                <div className={styles.btnAdd}>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Popplus</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' value={searchData} onChange={(e) => {setSearchData(e.target.value)}}/>
                    <Search />
                </div>
            </div>
            <div>
                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Popplus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng:</label>
                                <select name='area' onChange={(e)=>{getProvince(e.target.value, false)}}>
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
                                        <option value={data.id}>{data.name}</option>
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
                                <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" value={input['tail2']} onChange={handleChange}/>
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
                <Modal show={showUpdate} onHide={handleClose} onShow={()=>{}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal} >
                            <div>
                                <label>Vùng:</label>
                                <select defaultValue={inputUpdate.area_name}  name='area_name' onChange={(e)=>{getProvince(e.target.value); handleChangeUpdate(e)}} >
                                    {areaList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                <select defaultValue={inputUpdate.province_name} name='province_name' onChange={(e)=>{getBranch(e.target.value, true); handleChangeUpdate(e)}} >
                                    {provinceList.map(data => (
                                        <option value={data.name} selected={data.name==inputUpdate.province_name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select name='branch_name' onChange={(e)=>{handleChangeUpdate(e); updateBranch(e)}}>
                                {/* <option>{inputUpdate.branch_name}</option> */}
                                    {branchList.map(data => (
                                        <option value={data.mame} selected={inputUpdate.branch_name==data.name}>{data.name}</option>
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
                                <input type="number" name='tail2' placeholder='001 -> 999' min="1" value={inputUpdate['tail2']} max="999" onChange={handleChangeUpdate}
                                defaultValue={inputUpdate['tail2']}/>
                            </div>
                            <div>
                                <label>Name:</label>
                                <input type='text' value={inputUpdate.name} disabled/><ArrowClockwise onClick={() => {resetName()}} />
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
                                <input defaultValue={updateData.octet2_ip_OSPF_MGMT} value={inputUpdate['octet2_ip_OSPF_MGMT']} type="number" name='octet2_ip_OSPF_MGMT' onChange={handleChangeUpdate} />
                            </div>
                            <div>
                                <label>Octet2 IP MGMT:</label>
                                <input defaultValue={updateData.octet2_ip_MGMT} value={inputUpdate['octet2_ip_MGMT']} type="number" name='octet2_ip_MGMT' onChange={handleChangeUpdate} />
                            </div>
                            <div>
                                <label>Octet3 IP MGMT:</label>
                                <input defaultValue={updateData.octet3_ip_MGMT} value={inputUpdate['octet3_ip_MGMT']} type="number" name='octet3_ip_MGMT' onChange={handleChangeUpdate} />
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
                                <Button variant="success" onClick={()=>{handleShowUpdate(data)}}> Update</Button>
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