import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import styles from './Popplus.module.scss'


export default function Popplus(){

    const [popplusList, setPopplusList] = useState([])

    useEffect(() => { 
        const getPopplus = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/popplus/')
            setPopplusList(res.data)
        }
        getPopplus()
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
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{area: data}})
        .then(function(res){
            console.log(res)
            setProvinceList(res.data)
        })
    }
    
    const [branchList, setBranchList] = useState([])
    const getBranch = (data) => {
        axios.get('http://127.0.0.1:8000/api/branchprovince/', {params:{province: data}})
        .then(function(res){
            console.log(res)
            setBranchList(res.data)
        })
    }

    const handleAdd = (e) => {
        e.preventDefault()
        console.log('Hello')
    }

    return(
        <div>
            <div>
                <Button variant="primary" onClick={()=>{handleShow()}}> Add Popplus</Button>
                {/* {showAddPopplus?<AddPopplus data={showAddPopplus}/>:null} */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Popplus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div>
                                <label>Vùng: 
                                    <select onChange={(e)=>{getProvice(e.target.value)}}>
                                        {areaList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Tỉnh:
                                    <select onChange={(e)=>{getBranch(e.target.value)}}>
                                        {provinceList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Chi nhánh:
                                    <select>
                                        {branchList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Phần đuôi: 
                                    <select>
                                        <option value='P'>P</option>
                                        <option value='M'>M</option>
                                    </select>
                                    <input type="number" placeholder='001 -> 999' min="1" max="999"/>
                                </label>
                            </div>
                            <div>
                                <label>Area OSPF:
                                    <select>
                                        {[1,2,3,4,5,6,7,8,9].map(data => (
                                            <option value={data}>{data}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Octet2 IP OSPF MGMT:<input type="number" /></label>
                            </div>
                            <div>
                                <label>Octet2 IP MGMT:<input type="number" /></label>
                            </div>
                            <div>
                            <label>Octet3 IP MGMT:<input type="number" /></label>
                            </div>
                            <div>
                            <label>vlan PPPoE:
                                <select>
                                    {[30,31,32,33,34,35,36,37,38,39].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </label>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={{handleAdd}}>
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
                            <th>area_OSPF</th>
                            <th>octet2_ip_OSPF_MGMT</th>
                            <th>octet2_ip_MGMT </th>
                            <th>octet3_ip_MGMT </th>
                            <th>vlan_PPPoE </th>
                            <th>branch </th>
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
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </div>
        </div>
    )
}