import { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap'
import styles from './Pop.module.scss'


function UpdatePop({show, setShow, updateData, setUpdate}) {

    const [areaList, setAreaList] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [popplusList, setPopplusList] = useState([])
    const [inputUpdate, setInputUpdate] = useState([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/area/')
        .then(function(res){
            setAreaList(res.data)
        })
    }, [])

    useEffect( () => {
        let data = updateData
        console.log("updateData", updateData)
        setInputUpdate(0)
        const tail1 = data['name'][data['name'].length - 4]
        const tail2 = data['name'].substring(data['name'].length - 3, data['name'].length)
        setInputUpdate(data)
        getProvince(data.area_name)
        getBranch(data.province, false)
        setInputUpdate(values => ({...values, ['tail1']: tail1, ['tail2']: tail2}))
        setUpdate(prev => !prev)
    }, [updateData])

    const getProvince = (data, br) => {
        axios.get('http://127.0.0.1:8000/api/provincearea', {params:{'id': data}})
        .then(function(res){
            setProvinceList(res.data.data)
            if(!br){
                // console.log('check')
                getBranch(res.data.data[0].id, false)
                setInputUpdate(prev => ({...prev, 'province_name':res.data.data[0].name, 'province': res.data.data[0].id}))
            }
        })
    }

    const getBranch = (data, br) => {
        // console.log(data)
            axios.get('http://127.0.0.1:8000/api/branchprovince', {params:{'id': data}})
            .then(function(res){
                setBranchList(res.data.data)
                console.log('check')
                if(!br){
                    // console.log('check')
                    getPopplus(res.data.data[0].id)
                    setInputUpdate(prev => ({...prev, 'branch_name':res.data.data[0].name, 'branch':res.data.data[0].id}))
                }
            })    
    }

    const getPopplus = (data) => {
        console.log('check', data)
        axios.get('http://127.0.0.1:8000/api/popplusbrnach', {params:{'id': data}})
        .then(function(res){
            setPopplusList(res.data.data)
            console.log('check1', res.data.data)

            if(res.data.data.length !=0){
                setInputUpdate(values => ({...values, ['popPlus']: res.data.data[0].id, ['popPlus_name']: res.data.data[0].name}))
                
                // console.log("check1:", data)
                // console.log("check:", res.data.data.length)
            }
            if( res.data.data.length != 0){
                
                axios.get('http://127.0.0.1:8000/api/popname/', {params:{'popPlus': res.data.data[0].id,
                'tail1': inputUpdate['tail1'],
                'tail2': inputUpdate['tail2']}})
                .then(function(res){
                    // console.log("check", res.data)
                    setInputUpdate(prev => ({...prev, 'name': res.data.name}))
            })
            } else {
                setInputUpdate(prev => ({...prev, 'name': ''}))
            }
        })
    }

    function checkSequenceRing(se) {
        if(se > 63){
            return 63
        }
        if(se < 1){
            return 1
        }
        return se
    }

    function checkTail2(tail) {
        // console.log(tail)
        if(tail < 1){
            return 1
        }
        if(tail > 999){
            return 999
        }
        return tail
    }

    const handleClose = () => {
        setShow(false)
        setInputUpdate([])
    }

    const handleChangeUpdate = (event) => {
        const name = event.target.name
        var value
        if (name == 'sequence_ring'){
            value = checkSequenceRing(event.target.value)
        } else if (name =='tail2') {
            value = checkTail2(event.target.value)
        } else {
            value = event.target.value
        }

        var b= inputUpdate['popPlus']
        var t1 = inputUpdate['tail1']
        var t2 = inputUpdate['tail2']
        if (name == 'tail2'){
            t2 = value 
        }
        if (name == 'tail1'){
            t1 = value 
        }
        if (name == 'popPlus'){
            b = value 
        }

        axios.get('http://127.0.0.1:8000/api/popname/', {params:{
            'popPlus': b,
            'tail1': t1,
            'tail2': t2 
        }})
            .then(function(res){
                // console.log(res.data)
                setInputUpdate(prev => ({...prev, 'name': res.data.name}))
        })    
        setInputUpdate(values => ({...values, [name]: value}))
    }

    const handleUpdate = () => {
        console.log("inputupdate", inputUpdate)
        axios({
            method: "put",
            url: `http://127.0.0.1:8000/api/pop/${inputUpdate['id']}/`,
            data: inputUpdate,
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then( (res) => {
            console.log('update', res)
            setUpdate(prev => !prev)
          }
          )
        setShow(false)
        axios.get(`http://127.0.0.1:8000/api/updatedevice/`)
    }

    return ( 
        <div>
            {inputUpdate?
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                <Modal.Title>Update Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={styles.formModal}>
                        <div>
                            <label>Vùng: </label>
                            <select defaultValue={inputUpdate.area_name} name='area' onChange={(e)=>{getProvince(e.target.value, false); handleChangeUpdate(e)}}>
                                {areaList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Tỉnh:</label>
                            <select defaultValue={inputUpdate.province_name} name='province' onChange={(e)=>{getBranch(e.target.value, false); handleChangeUpdate(e)}}>
                                {provinceList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Chi nhánh:</label>
                            <select defaultValue={inputUpdate.branch_name} name='branch' onChange={(e)=>{getPopplus(e.target.value); handleChangeUpdate(e)}}>
                                {branchList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Popplus:</label>
                            <select defaultValue={inputUpdate.popPlus_name} name='popPlus' onChange={handleChangeUpdate}>
                                {popplusList.map(data => (
                                    <option value={data.id}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Phần đuôi: </label>
                            <select name='tail1' onChange={handleChangeUpdate}>
                                <option value='P' selected={'P' == inputUpdate['tail1']}>P</option>
                                <option value='M' selected={'M' == inputUpdate['tail1']}>M</option>
                                <option value='K' selected={'K' == inputUpdate['tail1']}>K</option>
                                <option value='V' selected={'V' == inputUpdate['tail1']}>V</option>
                                <option value='B' selected={'B' == inputUpdate['tail1']}>B</option>
                            </select>
                            <input type="number" name='tail2' placeholder='001 -> 999' min="1" value={inputUpdate['tail2']} max="999" onChange={handleChangeUpdate}
                            defaultValue={inputUpdate['tail2']}/>
                        </div>
                        <div>
                            <label>Name:</label>
                            <input defaultValue={inputUpdate.name} type='text' value={inputUpdate.name} disabled/>
                        </div>
                        <div>
                            <label>Metro:</label>
                            <select defaultValue={inputUpdate.metro} name='metro' onChange={handleChangeUpdate}>
                                {['MP01','MP02','MP03','MP04','MP05','MP06','MP07','MP08','MP09','MP10','MP11','MP12','MP13'].map(data => (
                                    <option value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Sequence Ring:</label>
                            <input type="number" name='sequence_ring' defaultValue={inputUpdate.sequence_ring} min="1" max="63" onChange={handleChangeUpdate} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
            :null}
        </div>
    );
}

export default UpdatePop;