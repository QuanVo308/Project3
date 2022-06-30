import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Table, Modal} from 'react-bootstrap'
import {Search} from 'react-bootstrap-icons'
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

    const handleSort = () => {
        if (reverse == 0){
            setReverse(1)
        } else {
            setReverse(0)
        }
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
            <button onClick={handleSort}>Test</button>
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
            {pageInfo&&<CustomPagination title='pop' pageInfo={pageInfo} searchData={searchData} setData={setPopList} setPageInfo={setPageInfo} sort={sort} reverse={reverse} update={update}/>}
        </div>
    )
}