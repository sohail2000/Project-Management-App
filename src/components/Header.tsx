// "use client"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useModalStore } from "~/store/modalStore"
import { useDashboardStore } from "~/store/dashboardStore"
import { useRouter } from "next/router"
import { SelectProjectBox } from "./SelectProjectBox"
// import { useDashboardStore } from "@/store/dashboardStore"

const Header = () => {

  const {setIsAddModalOpen, setIsProjectModalOpen} = useModalStore();
  const boardView = useDashboardStore().boardView

  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;

  return (

    <div className="mb-4 flex items-center justify-between  ">
      <h2 className="text-xl text-nowrap md:text-2xl  font-bold dark:text-white">
        {boardView === 'list' ? 'List View' : 'Kanban Board View'}

      </h2>

      <div className="flex justify-center items-center gap-2">
        <SelectProjectBox />
        <Button size={`sm`}
        variant="outline"
          onClick={() => {
            return setIsProjectModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>

        {projectId && <Button size={`sm`}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>}
      </div>
    </div>

  )
}

export default Header