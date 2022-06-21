
import {Nav} from 'react-bootstrap'
import styles from './Header.module.scss'

export default function Header(){
    return(
        <div className={styles.header}>
            <div className={styles.title}>QUẢN LÝ TÀI NGUYÊN LOGIC INFMB FTEL</div>
            <Nav variant="tabs">
                <Nav.Item>
                    <Nav.Link href="/popplus">Pop+</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/pop">Pop</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/device">Device</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}