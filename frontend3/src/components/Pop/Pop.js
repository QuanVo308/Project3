import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import styles from './Pop.module.scss'

export default function Pop(){

    const [popList, setPopList] = useState([])
    useEffect(() => { 
        const getPop = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/pop/')
            setPopList(res.data)
            console.log(res)
        }
        getPop()
    },[])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [areaList, setAreaList] = useState([])
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
        const value = event.target.value
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
          })
    }

    return(
        <div>
            <div className={styles.AddPop}>
                <Button variant="primary" onClick={()=>{handleShow()}}> Add Pop</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Pop</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div>
                                <label>Vùng: 
                                    <select name='area' onChange={(e)=>{getProvice(e.target.value)}}>
                                        <option>-</option>
                                        {areaList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Tỉnh:
                                    <select name='province' onChange={(e)=>{getBranch(e.target.value)}}>
                                        <option>-</option>
                                        {provinceList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Chi nhánh:
                                    <select name='branch' onChange={(e)=>{getPopplus(e.target.value)}}>
                                        <option>-</option>
                                        {branchList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Popplus:
                                    <select name='popPlus' onChange={handleChange}>
                                        <option>-</option>
                                        {popplusList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Phần đuôi: 
                                    <select name='tail1' onChange={handleChange}>
                                        <option>-</option>
                                        {['P','M','K','V','B'].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                    </select>
                                    <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" onChange={handleChange}/>
                                </label>
                            </div>
                            <div>
                                <label>Metro:
                                    <select name='metro' onChange={handleChange}>
                                        <option>-</option>
                                        {['MP01','MP02','MP03','MP04','MP05','MP06','MP07','MP08','MP09','MP10','MP11','MP12','MP13'].map(data => (
                                            <option value={data}>{data}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Sequence Ring:<input type="number" name='sequence_ring' placeholder='01->63' min="1" max="63" onChange={handleChange} /></label>
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
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </div>
        </div>
    )
}