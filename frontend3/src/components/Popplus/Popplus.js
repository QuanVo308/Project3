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
            // const pname = 'name'
            // const pvalue = res.data.data[0].name
            // console.log("check2", pname, pvalue)

            // setInput(values => ({...values, [pname]: pvalue}))

        })
    }

    const [input, setInput] = useState({})
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInput(values => ({...values, [name]: value}))
    }

    function buildFormData(formData, data, parentKey) {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
          Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
          });
        } else {
          const value = data == null ? '' : data;
      
          formData.append(parentKey, value);
        }
      }


    const handleAdd = () => {
        const formData = FormData()
        buildFormData(formData, input);
        console.log(input)
        console.log(formData)
        axios.post('http://127.0.0.1:8000/api/popplus/', {'data': formData})
            .then(function(res){
                console.log(res)
            })
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
                                    <select name='branch' onChange={handleChange}>
                                        <option>-</option>
                                        {branchList.map(data => (
                                            <option value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Phần đuôi: 
                                    <select name='tail1' onChange={handleChange}>
                                        <option>-</option>
                                        <option value='P'>P</option>
                                        <option value='M'>M</option>
                                    </select>
                                    <input type="number" name='tail2' placeholder='001 -> 999' min="1" max="999" onChange={handleChange}/>
                                </label>
                            </div>
                            <div>
                                <label>Area OSPF:
                                    <select name='area_OSPF' onChange={handleChange}>
                                        <option>-</option>
                                        {[1,2,3,4,5,6,7,8,9].map(data => (
                                            <option value={data}>{data}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Octet2 IP OSPF MGMT:<input type="number" name='octet2_ip_OSPF_MGMT' onChange={handleChange} /></label>
                            </div>
                            <div>
                                <label>Octet2 IP MGMT:<input type="number" name='octet2_ip_MGMT' onChange={handleChange} /></label>
                            </div>
                            <div>
                            <label>Octet3 IP MGMT:<input type="number" name='octet3_ip_MGMT' onChange={handleChange} /></label>
                            </div>
                            <div>
                            <label>vlan PPPoE:
                                <select name='vlan_PPPoE' onChange={handleChange}>
                                    <option>-</option>
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