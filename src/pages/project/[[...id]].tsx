import AddTaskModal from "~/components/AddTaskModal"
import { DashboardComponent } from "~/components/Dashboard"
import DeleteModal from "~/components/DeleteModal"

const ProjectPage = () => {
    return (
        <>
            <DashboardComponent />
            <AddTaskModal />
            <DeleteModal />
        </>
    )
}

export default ProjectPage
