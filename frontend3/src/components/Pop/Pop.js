import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import {Search} from 'react-bootstrap-icons'
import styles from './Pop.module.scss'

export default function Pop({tab}){

    const [popList, setPopList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteData, setDeleteData] = useState(false)
    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [popplusList, setPopplusList] = useState([])
    const [input, setInput] = useState({})
    const [inputUpdate, setInputUpdate] = useState({})
    const [updateData, setUpdateData] = useState()

    useEffect( () => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            getProvince(res.data[0].name, false)
        })
    }, [tab])

    useEffect(() => { 
        const getPop = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/pop/')
            // console.log(res)
            setPopList(res.data)
            resetName()
        }
        getPop()
    },[update])

    useEffect(() => { 
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
            // getProvince(res.data[0].name, true)
        })
        },[update])

    const handleClose = () => {
        setShowAdd(false)
        setShowUpdate(false)
        setShowDelete(false)
        setInput(0)
        setInputUpdate(0)
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
        // console.log(tail1, tail2)
        setInputUpdate(data)
        setInputUpdate(values => ({...values, ['tail1']: tail1, ['tail2']: tail2}))
        setUpdate(prev => !prev)
    }
    const handleShowDelete = () =>setShowDelete(true)

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

    const getProvince = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            if(!br){
                // console.log('check')
                getBranch(res.data.data[0].name, false)
                setInputUpdate(prev => ({...prev, 'province_name':res.data.data[0].name, 'province': res.data.data[0].id}))
            } else {
                // console.log('check2')
            }
        })
    }
    
    const getBranch = (data, br) => {
        // console.log(data)
        axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': data}})
        .then(function(res){
            setBranchList(res.data.data)
            if(!br){
                // console.log('check')
                getPopplus(res.data.data[0].name, false)
                setInputUpdate(prev => ({...prev, 'branch_name':res.data.data[0].name, 'branch':res.data.data[0].id}))
            }
        })
    }

    const getPopplus = (data) => {
        console.log('check', data)
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            console.log('check1', res.data.data)

            if(res.data.data.length !=0){
                setInputUpdate(values => ({...values, ['popPlus']: res.data.data[0].id, ['popPlus_name']: res.data.data[0].name}))
                setInput(prev => ({...prev, ['popPlus_name']: res.data.data[0].name, ['popPlus']: res.data.data[0].id}))
                // console.log("check1:", data)
                // console.log("check:", res.data.data.length)
            }
            if( res.data.data.length != 0){
                
                axios.get('http://127.0.0.1:8000/api/popname/', {params:{'popPlus': res.data.data[0].name,
                'tail1': inputUpdate['tail1'],
                'tail2': inputUpdate['tail2']}})
                .then(function(res){
                    // console.log("check", res.data)
                    setInputUpdate(prev => ({...prev, 'name': res.data.name}))
            })
            } else {
                setInputUpdate(prev => ({...prev, 'name': ''}))
            }
            // console.log('check2')

        })
    }

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

    const handleChangeUpdate = (event) => {
        const name = event.target.name
        var value
        if (name == 'sequence_ring'){
            value = checkSequenceRing(event.target.value)
        } else if (name =='tail2') {
            value = checkTail2(event.target.value)
        } else {
            value = event.target.value
        }

        var b= inputUpdate['popPlus_name']
        var t1 = inputUpdate['tail1']
        var t2 = inputUpdate['tail2']
        if (name == 'tail2'){
            t2 = value 
        }
        if (name == 'tail1'){
            t1 = value 
        }
        if (name == 'popPlus_name'){
            b = value 
        }

        axios.get('http://127.0.0.1:8000/api/popname/', {params:{
            'popPlus': b,
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
            console.log(res.data.data)
            setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id}))
        })  
    }

    const handleAdd = () => {
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
            console.log("kkk", res, err)
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

    const handleUpdate = () => {
        console.log("inputupdate", inputUpdate)
        axios({
            method: "put",
            url: `http://127.0.0.1:8000/api/pop/${inputUpdate['id']}/`,
            data: inputUpdate,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then( (res) => {
            console.log('update', res)
            setUpdate(prev => !prev)
          }
          )

        setShowUpdate(false)
        axios.get(`http://127.0.0.1:8000/api/updatedevice/`)
    }

    const resetName = () => {
        axios.get('http://127.0.0.1:8000/api/popname/', {params:{'popPlus': inputUpdate['popPlus_name'],
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
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Pop</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' />
                    <Search />
                </div>
            </div>
            <div>
                <Modal show={showAdd} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Pop</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
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
                                <select name='branch' onChange={(e)=>{getPopplus(e.target.value)}}>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Popplus:</label>
                                <select name='popPlus' onChange={handleChange}>
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
                
                {updateData?
                <Modal show={showUpdate} onHide={handleClose} onShow={()=>{getProvince(inputUpdate.area_name, true); getBranch(inputUpdate.province_name, true); getPopplus(inputUpdate.popPlus_name, true)}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={styles.formModal}>
                            <div>
                                <label>Vùng: </label>
                                <select defaultValue={inputUpdate.area_name} name='area' onChange={(e)=>{getProvince(e.target.value, false); handleChangeUpdate(e)}}>
                                    {areaList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Tỉnh:</label>
                                <select defaultValue={inputUpdate.province_name} name='province' onChange={(e)=>{getBranch(e.target.value, false); handleChangeUpdate(e)}}>
                                    {provinceList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Chi nhánh:</label>
                                <select defaultValue={inputUpdate.branch_name} name='branch' onChange={(e)=>{getPopplus(e.target.value); handleChangeUpdate(e)}}>
                                    {branchList.map(data => (
                                        <option value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Popplus:</label>
                                <select defaultValue={inputUpdate.popPlus_name} name='popPlus' onChange={handleChangeUpdate}>
                                    {popplusList.map(data => (
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
                                    <option value='K' selected={'K' == inputUpdate['tail1']}>K</option>
                                    <option value='V' selected={'V' == inputUpdate['tail1']}>V</option>
                                    <option value='B' selected={'B' == inputUpdate['tail1']}>B</option>
                                </select>
                                <input type="number" name='tail2' placeholder='001 -> 999' min="1" value={inputUpdate['tail2']} max="999" onChange={handleChangeUpdate}
                                defaultValue={inputUpdate['tail2']}/>
                            </div>
                            <div>
                                <label>Name:</label>
                                <input defaultValue={inputUpdate.name} type='text' value={inputUpdate.name} disabled/>
                            </div>
                            <div>
                                <label>Metro:</label>
                                <select defaultValue={updateData.metro} name='metro' onChange={handleChangeUpdate}>
                                    <option>-</option>
                                    {['MP01','MP02','MP03','MP04','MP05','MP06','MP07','MP08','MP09','MP10','MP11','MP12','MP13'].map(data => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Sequence Ring:</label>
                                <input type="number" name='sequence_ring' defaultValue={updateData.sequence_ring} value={input['sequence_ring']} min="1" max="63" onChange={handleChangeUpdate} />
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
                                <Button variant="success" onClick={()=>{handleShowUpdate(data)}}> Update</Button>
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