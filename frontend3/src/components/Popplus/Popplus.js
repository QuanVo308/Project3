import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal } from 'react-bootstrap'
import {Search, SortDown, SortUp} from 'react-bootstrap-icons'
import styles from './Popplus.module.scss'
import AddPopplus from './AddPopplus'
import UpdatePopplus from './UpdatePopplus'
import CustomPagination from '../CustomPagination/CustomPagination'

export default function Popplus(tab){

    const [popplusList, setPopplusList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteData, setDeleteData] = useState()
    const [updateData, setUpdateData] = useState()
    const [searchData, setSearchData] = useState('')
    const [pageInfo, setPageInfo] = useState()
    const [sort, setSort] = useState('id')
    const [reverse, setReverse] = useState(0)

    // setReverse(prev => !prev)
    // setSort()
    // setUpdate(prev => !prev)


    useEffect(() => { 
        const getPopplus = async()=>{
            let res = await axios.get(`http://127.0.0.1:8000/api/popplus/search/?search=${searchData}&page=${1}&sort=${sort}&reverse=${reverse}`)
            // console.log("results", res.data.results[0])
            setPopplusList(res.data.results)
            setPageInfo(res.data)
        }
        getPopplus()
        // console.log(reverse)
    },[update, tab, reverse])

    useEffect(() => {
        setSearchData('')
    }, [tab])

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api/popplus/search/?search=${searchData}&page=${pageInfo ? pageInfo.current_page : 1}&sort=${sort}&reverse=${reverse}`)
        .then(function(res){
            // console.log(res)
            setPopplusList(res.data.results)
        });
    },[searchData])

    const handleClose = () => {
        setShowDelete(false)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
    }
    const handleShowUpdate = (data) =>{
        // console.log(data)
        setShowUpdate(true)
        // console.log("update", data)
        setUpdateData(data)
    }
    const handleShowDelete = () =>setShowDelete(true)

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
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Popplus</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' value={searchData} onChange={(e) => {setSearchData(e.target.value); setUpdate(prev => !prev)}}/>
                    <Search />
                </div>
            </div>

            <div>   
                <AddPopplus show={showAdd} setShow={setShowAdd} setUpdate={setUpdate} />
                {updateData?
                    <UpdatePopplus show={showUpdate} setShow={setShowUpdate} updateData={updateData} setUpdate={setUpdate} />
                :null}
                <Modal show={showDelete} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Confirm!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>B???n c?? mu???n x??a d??? li???u n??y?</Modal.Body>
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
                            <th>area_OSPF {reverse === 1 && sort === 'area_OSPF' ? <SortUp onClick={()=>{handleClickSort('area_OSPF')}}/> : <SortDown onClick={()=>{handleClickSort('area_OSPF')}}/>}</th>
                            <th>octet2_ip_OSPF_MGMT {reverse === 1 && sort === 'octet2_ip_OSPF_MGMT' ? <SortUp onClick={()=>{handleClickSort('octet2_ip_OSPF_MGMT')}}/> : <SortDown onClick={()=>{handleClickSort('octet2_ip_OSPF_MGMT')}}/>}</th>
                            <th>octet2_ip_MGMT {reverse === 1 && sort === 'octet2_ip_MGMT' ? <SortUp onClick={()=>{handleClickSort('octet2_ip_MGMT')}}/> : <SortDown onClick={()=>{handleClickSort('octet2_ip_MGMT')}}/>}</th>
                            <th>octet3_ip_MGMT {reverse === 1 && sort === 'octet3_ip_MGMT' ? <SortUp onClick={()=>{handleClickSort('octet3_ip_MGMT')}}/> : <SortDown onClick={()=>{handleClickSort('octet3_ip_MGMT')}}/>}</th>
                            <th>vlan_PPPoE {reverse === 1 && sort === 'vlan_PPPoE' ? <SortUp onClick={()=>{handleClickSort('vlan_PPPoE')}}/> : <SortDown onClick={()=>{handleClickSort('vlan_PPPoE')}}/>}</th>
                            <th>branch {reverse === 1 && sort === 'branch_name' ? <SortUp onClick={()=>{handleClickSort('branch_name')}}/> : <SortDown onClick={()=>{handleClickSort('branch_name')}}/>}</th>
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

            {pageInfo&&<CustomPagination title='popplus' pageInfo={pageInfo} searchData={searchData} setData={setPopplusList} setPageInfo={setPageInfo} sort={sort} reverse={reverse} update={update}/>}

        </div>
    )
}