import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import {Search, SortDown, SortUp} from 'react-bootstrap-icons'
import styles from './Pop.module.scss'
import AddPop from './AddPop'
import UpdatePop from './UpdatePop'
import CustomPagination from '../CustomPagination/CustomPagination'


export default function Pop({tab}){

    const [popList, setPopList] = useState([])
    const [update, setUpdate] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteData, setDeleteData] = useState(false)
    const [updateData, setUpdateData] = useState()
    const [searchData, setSearchData] = useState()
    const [pageInfo, setPageInfo] = useState()
    const [sort, setSort] = useState('id')
    const [reverse, setReverse] = useState(0)


    useEffect(() => { 
        const getPop = async()=>{
            let res = await axios.get(`http://127.0.0.1:8000/api/pop/search/?search=${searchData}&page=${1}&sort=${sort}&reverse=${reverse}`)
            // console.log("results", res.data.results[0])
            setPopList(res.data.results)
            setPageInfo(res.data)
        }
        getPop()
    },[update, tab, reverse])

    useEffect(() => {
        setSearchData('')
    }, [tab])

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api/pop/search/?search=${searchData}&page=${pageInfo ? pageInfo.current_page : 1}&sort=${sort}&reverse=${reverse}`)
        .then(function(res){
            setPopList(res.data.results)
        });
    },[searchData])

    const handleClose = () => {
        setShowDelete(false)
    }
    const handleShowAdd = () => {
        setShowAdd(true);
    }
    
    const handleShowUpdate = (data) => {
        setShowUpdate(true)
        setUpdateData(data)
    }

    const handleShowDelete = () =>setShowDelete(true)

    const handleDelete = () => {
        axios.delete(`http://127.0.0.1:8000/api/pop/${deleteData}/`)
        .then(function (res) {
            setUpdate(prev => !prev)
          })
        .catch( (res) => {
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
                    <Button variant="primary" onClick={()=>{handleShowAdd()}}> Add Pop</Button>
                </div>
                <div className={styles.btnSearch}>
                    <input className={styles.SearchInput} type='text' placeholder='Search...' value={searchData} onChange={(e) => {setSearchData(e.target.value); setUpdate(prev => !prev)}} />
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
                            <th>ID {reverse === 1 && sort === 'id' ? <SortUp onClick={()=>{handleClickSort('id')}}/> : <SortDown onClick={()=>{handleClickSort('id')}}/>}</th>
                            <th>Name {reverse === 1 && sort === 'name' ? <SortUp onClick={()=>{handleClickSort('name')}}/> : <SortDown onClick={()=>{handleClickSort('name')}}/>}</th>
                            <th>Ring {reverse === 1 && sort === 'ring' ? <SortUp onClick={()=>{handleClickSort('ring')}}/> : <SortDown onClick={()=>{handleClickSort('ring')}}/>}</th>
                            <th>Range Ip {reverse === 1 && sort === 'range_ip' ? <SortUp onClick={()=>{handleClickSort('range_ip')}}/> : <SortDown onClick={()=>{handleClickSort('range_ip')}}/>}</th>
                            <th>Metro {reverse === 1 && sort === 'metro' ? <SortUp onClick={()=>{handleClickSort('metro')}}/> : <SortDown onClick={()=>{handleClickSort('metro')}}/>}</th>
                            <th>sequence ring {reverse === 1 && sort === 'sequence_ring' ? <SortUp onClick={()=>{handleClickSort('sequence_ring')}}/> : <SortDown onClick={()=>{handleClickSort('sequence_ring')}}/>}</th>
                            <th>vlan_PPPoE {reverse === 1 && sort === 'vlan_PPPoE' ? <SortUp onClick={()=>{handleClickSort('vlan_PPPoE')}}/> : <SortDown onClick={()=>{handleClickSort('vlan_PPPoE')}}/>}</th>
                            <th>PopPlus {reverse === 1 && sort === 'popPlus_name' ? <SortUp onClick={()=>{handleClickSort('popPlus_name')}}/> : <SortDown onClick={()=>{handleClickSort('popPlus_name')}}/>}</th>
                            <th>Province {reverse === 1 && sort === 'province_name' ? <SortUp onClick={()=>{handleClickSort('province_name')}}/> : <SortDown onClick={()=>{handleClickSort('province_name')}}/>}</th>
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
            {pageInfo&&<CustomPagination title='pop' pageInfo={pageInfo} searchData={searchData} setData={setPopList} setPageInfo={setPageInfo} sort={sort} reverse={reverse} update={update}/>}
        </div>
    )
}