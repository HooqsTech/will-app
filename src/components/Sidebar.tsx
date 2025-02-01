const Sidebar = () => {
    var menuItems = [
        "Basic Details",
        "Assets",
        "Liabilities"
    ]
    return (
        <div className="w-40 border-r-2 h-full flex flex-col border-slate-300">
            {menuItems.map(item => (
                <a className="py-10">{item}</a>
            ))}
        </div>
    )
}

export default Sidebar