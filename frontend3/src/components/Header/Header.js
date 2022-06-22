
import {Nav} from 'react-bootstrap'
import styles from './Header.module.scss'
import {Tabs, Tab} from 'react-bootstrap';
import Popplus from '../Popplus/Popplus';
import Pop from '../Pop/Pop';
import Device from '../Device/Device';



export default function Header(){
    return(
        // <div className={styles.header}>
        //     <div className={styles.title}>QUẢN LÝ TÀI NGUYÊN LOGIC INFMB FTEL</div>
        //     <Nav variant="tabs">
        //         <Nav.Item>
        //             <Nav.Link href="/popplus">Pop+</Nav.Link>
        //         </Nav.Item>
        //         <Nav.Item>
        //             <Nav.Link href="/pop">Pop</Nav.Link>
        //         </Nav.Item>
        //         <Nav.Item>
        //             <Nav.Link href="/device">Device</Nav.Link>
        //         </Nav.Item>
        //     </Nav>
        // </div>
        <div className={styles.header}>
            <div className={styles.title}>QUẢN LÝ TÀI NGUYÊN LOGIC INFMB FTEL</div>
            <Tabs defaultActiveKey="popplus" id="header" className="mb-3">
                <Tab eventKey="popplus" title="Popplus">
                    <Popplus />
                </Tab>
                <Tab eventKey="pop" title="Pop">
                    <Pop />
                </Tab>
                <Tab eventKey="device" title="Device" >
                    <Device />
                </Tab>
            </Tabs>
        </div>
    )
}