import {Pagination} from 'react-bootstrap';


function CustomPagination(pageInfo) {
    console.log('pageInfo',pageInfo)
    // let active = 2;
    let items = [];
    const maxPage = pageInfo.max_page
    for (let number = 1; number <= maxPage; number++) {
        items.push(
            <Pagination.Item key={number} active={number === pageInfo.current_page}>
                {number}
            </Pagination.Item>,
        );
    }
    return ( 
        <div>
            {items&&<Pagination>{items}</Pagination>}
        </div>
    );
}

export default CustomPagination;