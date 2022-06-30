import { useEffect, useState } from 'react';
import {Pagination} from 'react-bootstrap';
import axios from 'axios'
import styles from './CustomPagination.module.scss'


function CustomPagination({title, pageInfo, setData, setPageInfo, searchData, sort, reverse}) {

    // const [currentPage, setCurrentPage] = useState()
    
    let pageNumber = [];
    let maxPage = pageInfo.max_page
        for (let number = 1; number <= maxPage; number++) {
            pageNumber.push(number);
        }

    const handleChangePage = (value) => {
        // const value = e.target.text
        if (value < 1){
            value = 1
        }
        if (value > pageInfo.maxPage){
            value = pageInfo.maxPage
        }
        console.log(value)
        axios.get(`http://127.0.0.1:8000/api/${title}/search/?search=${searchData}&page=${value}&sort=${sort}&reverse=${-1}`)
        .then(function (res) {
            setData(res.data.results)
            setPageInfo(res.data)
          })
    }
        

    return ( 
        <div className={styles.divPagination}>
            <Pagination >
                <Pagination.First key={1} onClick={()=>{handleChangePage(1)}}>First</Pagination.First>
                <Pagination.Prev onClick={()=>handleChangePage(pageInfo.current_page - 1)}></Pagination.Prev>
                {pageNumber.map(number => (
                    <Pagination.Item key={number} active={number === pageInfo.current_page} onClick={()=>handleChangePage(number)}>
                        {number}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={()=>handleChangePage(pageInfo.current_page + 1)}></Pagination.Next>
                <Pagination.Last key={maxPage} onClick={(e)=>{handleChangePage(maxPage)}}>Last</Pagination.Last>
            </Pagination>
        </div>
    );
}

export default CustomPagination;