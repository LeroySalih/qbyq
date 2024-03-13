export default function Layout ({
    children,
    users, 
    results
}: {
    children: React.ReactNode,
    users: React.ReactNode,
    results: React.ReactNode,
}) {

    return (<div>
        <div>{children}</div>
        <div>{users}</div>
        <div>{results}</div>
    </div>)
}