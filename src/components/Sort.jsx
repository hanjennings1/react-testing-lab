function Sort({onSort}){
    return(
        <select className="sort-select" onChange={(e)=>{
            onSort(e.target.value)
        }}>
            <option value={"description"}>Sort: Description</option>
            <option value={"category"}>Sort: Category</option>
        </select>
    )
}
export default Sort