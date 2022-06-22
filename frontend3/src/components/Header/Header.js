
import {Nav} from 'react-bootstrap'
import styles from './Header.module.scss'
import { Routes, Route, Link, useNavigate, useLocation  } from "react-router-dom";

export default function Header(){
    return(
        <div className={styles.header}>
            <div className={styles.title}>QUẢN LÝ TÀI NGUYÊN LOGIC INFMB FTEL</div>
            <Nav variant="tabs">
                <Nav.Item>
                    {/* <Nav.Link href="/popplus">Pop+</Nav.Link> */}
                    <Link to="/popplus" className={styles.tabzxc} >Pop+</Link>
                </Nav.Item>
                <Nav.Item>
                    {/* <Nav.Link href="/pop">Pop</Nav.Link> */}
                    <Link to="/pop" className={styles.tabzxc}>Pop</Link>
                </Nav.Item>
                <Nav.Item>
                    {/* <Nav.Link href="/device">Device</Nav.Link> */}
                    <Link to="/device" className={styles.tabzxc}>Device</Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}