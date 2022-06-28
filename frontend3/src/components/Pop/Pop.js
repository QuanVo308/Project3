import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import {Search} from 'react-bootstrap-icons'
import styles from './Pop.module.scss'
import AddPop from './AddPop'
import UpdatePop from './UpdatePop'

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
    const [searchData, setSearchData] = useState()

    // useEffect( () => {
    //     axios.get('http://127.0.0.1:8000/api/area/')
    //     .then(function(res){
    //         setAreaList(res.data)
    //         getProvince(res.data[0].name, false)
    //     })
    // }, [tab])

    useEffect(() => { 
        const getPop = async()=>{
            let res = await axios.get('http://127.0.0.1:8000/api/pop/')
            // console.log(res)
            setPopList(res.data)
            // resetName()
        }
        getPop()
    },[update, tab])

    // useEffect(() => { 
    //     axios.get('http://127.0.0.1:8000/api/area/')
    //     .then(function(res){
    //         setAreaList(res.data)
    //         // getProvince(res.data[0].name, true)
    //     })
    //     },[update])

    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/searchpop/',{params:{'search': searchData}})
        .then(function(res){
            // console.log(res)
            setPopList(res.data.data)
        });
    },[searchData])

    const handleClose = () => {
        // setShowAdd(false)
        // setShowUpdate(false)
        setShowDelete(false)
        // setInput(0)
        // setInputUpdate(0)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
        // getProvince(1, false)
    }
    
    const handleShowUpdate = (data) => {
        setShowUpdate(true)
        // setInputUpdate(0)
        setUpdateData(data)
        // const tail1 = data['name'][data['name'].length - 4]
        // const tail2 = data['name'].substring(data['name'].length - 3, data['name'].length)
        // // console.log(tail1, tail2)
        // setInputUpdate(data)
        // setInputUpdate(values => ({...values, ['tail1']: tail1, ['tail2']: tail2}))
        // setUpdate(prev => !prev)
    }

    
    const handleShowDelete = () =>setShowDelete(true)

    // function checkSequenceRing(se) {
    //     if(se > 63){
    //         return 63
    //     }
    //     if(se < 1){
    //         return 1
    //     }
    //     return se
    // }

    // function checkTail2(tail) {
    //     // console.log(tail)
    //     if(tail < 1){
    //         return 1
    //     }
    //     if(tail > 999){
    //         return 999
    //     }
    //     return tail
    // }

    // const getProvince = (data, br) => {
    //     axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'name': data}})
    //     .then(function(res){
    //         setProvinceList(res.data.data)
    //         if(!br){
    //             // console.log('check')
    //             getBranch(res.data.data[0].id, false)
    //             setInputUpdate(prev => ({...prev, 'province_name':res.data.data[0].name, 'province': res.data.data[0].id}))
    //         } else {
    //             // console.log('check2')
    //         }
    //     })
    // }
    
    // const getBranch = (data, br) => {
    //     // console.log(data)

    //     axios.get(`http://127.0.0.1:8000/api/province/${data}/`, {})
    //     .then(function(res){
    //         axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'name': res.data.name}})
    //         .then(function(res){
    //             setBranchList(res.data.data)
    //             console.log('check')
    //             if(!br){
    //                 // console.log('check')
    //                 getPopplus(res.data.data[0].name, false)
    //                 setInputUpdate(prev => ({...prev, 'branch_name':res.data.data[0].name, 'branch':res.data.data[0].id}))
    //             }
    //     })
    //     })
        
        
    // }

    // const getPopplus = (data) => {
    //     console.log('check', data)
    //     axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'name': data}})
    //     .then(function(res){
    //         setPopplusList(res.data.data)
    //         console.log('check1', res.data.data)

    //         if(res.data.data.length !=0){
    //             setInputUpdate(values => ({...values, ['popPlus']: res.data.data[0].id, ['popPlus_name']: res.data.data[0].name}))
    //             setInput(prev => ({...prev, ['popPlus_name']: res.data.data[0].name, ['popPlus']: res.data.data[0].id}))
    //             // console.log("check1:", data)
    //             // console.log("check:", res.data.data.length)
    //         }
    //         if( res.data.data.length != 0){
                
    //             axios.get('http://127.0.0.1:8000/api/popname/', {params:{'popPlus': res.data.data[0].name,
    //             'tail1': inputUpdate['tail1'],
    //             'tail2': inputUpdate['tail2']}})
    //             .then(function(res){
    //                 // console.log("check", res.data)
    //                 setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //         })
    //         } else {
    //             setInputUpdate(prev => ({...prev, 'name': ''}))
    //         }
    //         // console.log('check2')

    //     })
    // }

    // const handleChange = (event) => {
    //     const name = event.target.name
    //     var value
    //     if (name == 'sequence_ring'){
    //         value = checkSequenceRing(event.target.value)
    //     } else if (name =='tail2') {
    //         value = checkTail2(event.target.value)
    //     } else {
    //         value = event.target.value
    //     }
    //     setInput(values => ({...values, [name]: value}))
    // }

    // const handleChangeUpdate = (event) => {
    //     const name = event.target.name
    //     var value
    //     if (name == 'sequence_ring'){
    //         value = checkSequenceRing(event.target.value)
    //     } else if (name =='tail2') {
    //         value = checkTail2(event.target.value)
    //     } else {
    //         value = event.target.value
    //     }

    //     var b= inputUpdate['popPlus_name']
    //     var t1 = inputUpdate['tail1']
    //     var t2 = inputUpdate['tail2']
    //     if (name == 'tail2'){
    //         t2 = value 
    //     }
    //     if (name == 'tail1'){
    //         t1 = value 
    //     }
    //     if (name == 'popPlus_name'){
    //         b = value 
    //     }

    //     axios.get('http://127.0.0.1:8000/api/popname/', {params:{
    //         'popPlus': b,
    //         'tail1': t1,
    //         'tail2': t2 
    //     }})
    //         .then(function(res){
    //             // console.log(res.data)
    //             setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //     })

        
    //     setInputUpdate(values => ({...values, [name]: value}))
    // }

    // const updateBranch = (e) => {
    //     const value = e.target.value
    //     // console.log(value)
    //     axios.get('http://127.0.0.1:8000/api/branchname/', {params:{'name': value}})
    //     .then(function(res){
    //         console.log(res.data.data)
    //         setInputUpdate(values => ({...values, ['branch']: res.data.data[0].id}))
    //     })  
    // }

    // const handleAdd = () => {
    //     const formData = new FormData()
    //     Object.entries(input).map( ([key, value]) => {
    //         formData.append(key, value)
            
    //     })
    //     console.log("check", formData)
    //     axios({
    //         method: "post",
    //         url: "http://127.0.0.1:8000/api/pop/",
    //         data: formData,
    //         headers: { "Content-Type": "multipart/form-data" },
    //       })
    //       .then(function (response) {
    //         console.log(response);
    //         setUpdate(prev => !prev)
    //       })
    //       .catch( (res,err) => {
    //         console.log("kkk", res, err)
    //       })

    //     setShowAdd(false)
    // }

    const handleDelete = () => {
        axios.delete(`http://127.0.0.1:8000/api/pop/${deleteData}/`)
        .then(function (res) {
            setUpdate(prev => !prev)
          })
        .catch( (res) => {
        })
        setShowDelete(false)
    }

    // const handleUpdate = () => {
    //     console.log("inputupdate", inputUpdate)
    //     axios({
    //         method: "put",
    //         url: `http://127.0.0.1:8000/api/pop/${inputUpdate['id']}/`,
    //         data: inputUpdate,
    //         headers: { "Content-Type": "multipart/form-data" },
    //       })
    //       .then( (res) => {
    //         console.log('update', res)
    //         setUpdate(prev => !prev)
    //       }
    //       )

    //     setShowUpdate(false)
    //     axios.get(`http://127.0.0.1:8000/api/updatedevice/`)
    // }

    // const resetName = () => {
    //     axios.get('http://127.0.0.1:8000/api/popname/', {params:{'popPlus': inputUpdate['popPlus_name'],
    //         'tail1': inputUpdate['tail1'],
    //         'tail2': inputUpdate['tail2']}})
    //     .then(function(res){
    //         // console.log(res.data)
    //         setInputUpdate(prev => ({...prev, 'name': res.data.name}))
    //     })
    // }

    return(
        <div>
            <div className={styles.AddSearch}>
                <div className={styles.btnAdd}>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Pop</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' value={searchData} onChange={(e) => {setSearchData(e.target.value)}} />
                    <Search />
                </div>
            </div>
            <div>
                <AddPop show={showAdd} setShow={setShowAdd} setUpdate={setUpdate} />
                {updateData?
                <UpdatePop show={showUpdate} setShow={setShowUpdate} updateData={updateData} setUpdate={setUpdate} />
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