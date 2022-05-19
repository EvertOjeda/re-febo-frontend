import React, { Fragment } from "react";
import { Input, Modal, Table} from 'antd';
const SearchModal = (props) => {
    return (
        <Fragment>
            <Modal title={props.title} visible={props.visible} footer={false} onCancel={props.onCancel}>   
                <Input
                    id="SearchInput"
                    onChange={props.onInteractiveSearch}
                    ref={props.searchInputFocus}
                    value={props.searchInput}
                    style={{
                        float:'right',
                        width: 200,
                        marginBottom:'10px',
                    }} />
                <Table
                    onRow={(record, rowIndex) => {
                        return {    
                            onDoubleClick: event => {
                                props.onSearchRowDoubleClick(record);
                            },
                        };
                    }} 
                    columns={props.columns} 
                    dataSource={props.dataSource} 
                    size="small"/>
            </Modal>
        </Fragment>
    );
}
export default SearchModal;