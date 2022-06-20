import { useEffect, useState } from 'react'
import axios from 'axios'
import {Table} from 'react-bootstrap'
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

    return(
        <div>
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
                            <td>{data.popPlus}</td>
                            <td>{data.province_name}</td>
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </div>
        </div>
    )
}