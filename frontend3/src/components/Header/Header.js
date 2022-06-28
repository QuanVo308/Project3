
import styles from './Header.module.scss'
import {Tabs, Tab} from 'react-bootstrap';
import Popplus from '../Popplus/Popplus';
import Pop from '../Pop/Pop';
import Device from '../Device/Device';
import { useEffect, useState } from 'react'


export default function Header(){
    const [tab, setTab] = useState("popplus")
    return(
        <div className={styles.header}>
            <div className={styles.title}>QUẢN LÝ TÀI NGUYÊN LOGIC INFMB FTEL</div>
            <Tabs defaultActiveKey="popplus" id="header" onSelect={ setTab} className="mb-3">
                <Tab eventKey="popplus" title="Popplus" >
                    <Popplus tab = {tab} />
                </Tab>
                <Tab eventKey="pop" title="Pop">
                    <Pop tab = {tab}/>
                </Tab>
                <Tab eventKey="device" title="Device" >
                    <Device tab = {tab}/>
                </Tab>
            </Tabs>
        </div>
    )
}