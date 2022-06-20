
import {Nav} from 'react-bootstrap'

export default function Header(){
    return(
        <div>
            <div>QUẢN LÝ TÀI NGUYÊN LOGIC INFMB FTEL</div>
            <Nav variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                    <Nav.Link href="">Pop+</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="">Pop</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="">Device</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}