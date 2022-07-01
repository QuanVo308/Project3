import { useEffect, useState } from 'react'
import axios from 'axios'
import {Table, Button, Modal} from 'react-bootstrap'
import {Search, SortUp, SortDown} from 'react-bootstrap-icons'
import styles from './Device.module.scss'
import AddDevice from './AddDevice'
import UpdateDevice from './UpdateDevice'
import CustomPagination from '../CustomPagination/CustomPagination'


export default function Device({tab}){

    const [deviceList, setDeviceList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteData, setDeleteData] = useState()
    const [updateData, setUpdateData] = useState()
    const [searchData, setSearchData] = useState()
    const [pageInfo, setPageInfo] = useState()
    const [sort, setSort] = useState('id')
    const [reverse, setReverse] = useState(0)


    useEffect(() => { 
        const getDevice = async()=>{
            let res = await axios.get(`http://127.0.0.1:8000/api/device/search/?search=${searchData}&page=${1}&sort=${sort}&reverse=${reverse}`)
            // console.log("results", res.data.results[0])
            setDeviceList(res.data.results)
            setPageInfo(res.data)
        }
        getDevice()
    },[update, tab, reverse])

    useEffect(() => {
        setSearchData('')
    }, [tab])

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api/device/search/?search=${searchData}&page=${pageInfo ? pageInfo.current_page : 1}&sort=${sort}&reverse=${reverse}`)
        .then(function(res){
            // console.log(res)
            setDeviceList(res.data.results)
        });
    },[searchData])

    const handleClose = () => {
        setShowDelete(false)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
    }
    const handleShowUpdate = (data) =>{
        if (data.role === "AGG"){
            data['type'] = data.name.substring(0,2)
        }
        setShowUpdate(true)
        setUpdateData(data)
    }
    const handleShowDelete = () =>setShowDelete(true)

    const handleDelete = () => {
        // console.log(deleteData)
        axios.delete(`http://127.0.0.1:8000/api/device/${deleteData}/`)
        .then(function (res) {
            console.log(res);
            setUpdate(prev => !prev)
          })
        .catch( (res) => {
            console.log(res)
        })

        setShowDelete(false)
    }

    // const handleSort = () => {
    //     if (reverse == 0){
    //         setReverse(1)
    //     } else {
    //         setReverse(0)
    //     }
    //     setUpdate(prev => !prev)
    // }

    const handleClickSort = (titleSort) => {
        setSort(titleSort)
        if (reverse === 0){
            setReverse(1)
        } else {
            setReverse(0)
        }
        console.log('check', titleSort)
        setUpdate(prev => !prev)
    }

    return(
        <div>
            <div className={styles.AddSearch}>
                <div className={styles.btnAdd}>
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Device</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' value={searchData} onChange={(e) => {setSearchData(e.target.value); setUpdate(prev => !prev)}}/>
                    <Search />
                </div>
            </div>
            <div>
                <AddDevice show={showAdd} setShow={setShowAdd} setUpdate={setUpdate} />
                
                {updateData?
                <UpdateDevice show={showUpdate} setShow={setShowUpdate} updateData={updateData} setUpdate={setUpdate} />
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
                            <th>ID {reverse === 1 && sort === 'id' ? <SortUp onClick={()=>{handleClickSort('id')}}/> : <SortDown onClick={()=>{handleClickSort('id')}}/>}</th>
                            <th>Name {reverse === 1 && sort === 'name' ? <SortUp onClick={()=>{handleClickSort('name')}}/> : <SortDown onClick={()=>{handleClickSort('name')}}/>}</th>
                            <th>Role {reverse === 1 && sort === 'role' ? <SortUp onClick={()=>{handleClickSort('role')}}/> : <SortDown onClick={()=>{handleClickSort('role')}}/>}</th>
                            <th>Ip {reverse === 1 && sort === 'ip' ? <SortUp onClick={()=>{handleClickSort('ip')}}/> : <SortDown onClick={()=>{handleClickSort('ip')}}/>}</th>
                            <th>Pop {reverse === 1 && sort === 'pop_name' ? <SortUp onClick={()=>{handleClickSort('pop_name')}}/> : <SortDown onClick={()=>{handleClickSort('pop_name')}}/>}</th>
                            <th>Brand {reverse === 1 && sort === 'brand_name' ? <SortUp onClick={()=>{handleClickSort('brand_name')}}/> : <SortDown onClick={()=>{handleClickSort('brand_name')}}/>}</th> 
                            <th>Subnet {reverse === 1 && sort === 'subnet' ? <SortUp onClick={()=>{handleClickSort('subnet')}}/> : <SortDown onClick={()=>{handleClickSort('subnet')}}/>}</th>
                            <th>Gateway {reverse === 1 && sort === 'gateway' ? <SortUp onClick={()=>{handleClickSort('gateway')}}/> : <SortDown onClick={()=>{handleClickSort('gateway')}}/>}</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {deviceList.map(data => (
                        <tbody key={data.id}>
                        <tr>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{data.role}</td>
                            <td>{data.ip }</td>
                            <td>{data.pop_name }</td>
                            <td>{data.brand_name}</td>
                            <td>{data.subnet}</td>
                            <td>{data.gateway}</td>
                            <td>
                                <Button variant="success" onClick={()=>{handleShowUpdate(data)}}> Update</Button>
                                <Button variant="danger" onClick={()=>{handleShowDelete(); setDeleteData(data.id)}}> Delete</Button>
                            </td>
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </div>
            {pageInfo&&<CustomPagination title='device' pageInfo={pageInfo} setData={setDeviceList} searchData={searchData} setPageInfo={setPageInfo} sort={sort} reverse={reverse} update={update}/>}
        </div>
    )
}