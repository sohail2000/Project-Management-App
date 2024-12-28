const LoadingTask = () => {
    return (
        <div className="flex items-center justify-start py-8 text-lg font-medium space-x-2">
            <span>Loading tasks...</span>
            <span className="inline-flex gap-1">
                <span className="animate-bounce">🚚</span>
                <span className="animate-bounce delay-100">🚚</span>
            </span>
        </div>
    )
}

export default LoadingTask