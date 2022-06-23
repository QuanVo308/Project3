import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import styles from './Pop.module.scss'

export default function Pop(){

    const [popList, setPopList] = useState([])
    const [update, setUpdate] = useState(false)
    useEffect(() => { 
        const getPop = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/pop/')
            setPopList(res.data)
            // console.log(res)
        }
        getPop()
    },[])

    useEffect(() => { 
        const getPop = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/pop/')
            setPopList(res.data)
            // console.log(res)
        }
        getPop()
    },[update])


    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(false);

    const handleClose = () => {setShowAdd(false);setShowUpdate(false);setShowDelete(false); setInput(0)}
    const handleShowAdd = () => setShowAdd(true);
    const handleShowUpdate = () =>setShowUpdate(true)
    const handleShowDelete = () =>setShowDelete(true)

    const [areaList, setAreaList] = useState([])
    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
        })
        },[])


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
        if(tail < 1){
            return 1
        }
        if(tail > 999){
            return 999
        }
        return tail
    }

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

    const [popplusList, setPopplusList] = useState([])
    const getPopplus = (data) => {
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
        .then(function(res){
            setPopplusList(res.data.data)
        })
    }

    const [input, setInput] = useState({})
    const handleChange = (event) => {
        const name = event.target.name
        var value
        if (name == 'sequence_ring'){
            value = checkSequenceRing(event.target.value)
        } else if (name =='tail2') {
            value = checkTail2(event.target.value)
        } else {
            value = event.target.value
        }
        setInput(values => ({...values, [name]: value}))
    }

    const handleAdd = () => {
        const formData = new FormData()
        Object.entries(input).map( ([key, value]) => {
            formData.append(key, value)
            
        })
        console.log(input)
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

        setShowAdd(false)
    }

    const handleDelete = () => {
        // console.log(deleteData)
        axios.delete(`http://127.0.0.1:8000/api/pop/${deleteData}/`)
        .then(function (res) {
            console.log(res);
            setUpdate(prev => !prev)
          })
        .catch( (res) => {
            console.log(res)
        })

        setShowDelete(false)
    }

    return(
        <div>
            <div>
                <div>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Pop</Button>
                </div>
                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Pop</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
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
                                <select name='branch' onChange={(e)=>{getPopplus(e.target.value)}}>
                                    <option>-</option>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Popplus:</label>
                                <select name='popPlus' onChange={handleChange}>
                                    <option>-</option>
                                    {popplusList.map(data => (
                                        <option value={data.name}>{data.name}</option>
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

                <Modal show={showUpdate} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body></Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Update
                    </Button>
                    </Modal.Footer>
                </Modal>

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
                            <th>Ring</th>
                            <th>Range Ip</th>
                            <th>Metro </th>
                            <th>sequence ring</th>
                            <th>vlan_PPPoE </th>
                            <th>PopPlus</th>
                            <th>Province</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {popList.map(data => (
                        <tbody key={data.id}>
                        <tr>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{data.ring}</td>
                            <td>{data.range_ip }</td>
                            <td>{data.metro }</td>
                            <td>{data.sequence_ring}</td>
                            <td>{data.vlan_PPPoE}</td>
                            <td>{data.popPlus_name}</td>
                            <td>{data.province_name}</td>
                            <td>
                                <Button variant="success" onClick={()=>{handleShowUpdate()}}> Update</Button>
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