import AddTaskModal from "~/components/AddTaskModal"
import { DashboardComponent } from "~/components/Dashboard"
import DeleteModal from "~/components/DeleteModal"
// import SearchBox from "~/components/SearchBox"

const Home = () => {
    return (
        // <div>Home</div>
        <>
            {/* <SearchBox /> */}
            <DashboardComponent />
            <AddTaskModal task={null} />
            <DeleteModal />
        </>
    )
}

export default Home